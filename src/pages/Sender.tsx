import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { EMAIL_API_ENDPOINT, EMAIL_CONFIGS_API_ENDPOINT, EMAIL_TEMPLATES_API_ENDPOINT } from '@/config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Helper function to get CSRF token from cookies
function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookiePart = parts.pop();
    if (cookiePart) {
      return cookiePart.split(';').shift() || null;
    }
  }
  return null;
}

const Sender = () => {
  const { companySlug } = useParams<{ companySlug?: string }>();
  const { toast } = useToast();
  
  // Define interface for email configurations
  interface EmailConfig {
    id: number;
    host: string;
    port: number;
    host_user: string;
    is_active: boolean;
  }
  
  // Define interface for email templates
  interface EmailTemplate {
    id: number;
    subject: string;
    content: string;
    company: number | null;
    company_name: string | null;
    is_global: boolean;
  }

  const [emailConfigs, setEmailConfigs] = useState<EmailConfig[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [templateLoadError, setTemplateLoadError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    to: '',
    from: '', // Will be set from selected configuration
    subject: '',
    body: ''
  });
  const [isSending, setIsSending] = useState(false);

  // Fetch email configurations when component mounts
  // Fetch email templates based on company slug
  useEffect(() => {
    const fetchEmailTemplates = async () => {
      try {
        setIsLoadingTemplates(true);
        setTemplateLoadError(null);
        
        console.log('Fetching email templates from:', EMAIL_TEMPLATES_API_ENDPOINT);
        
        // Construct URL with company slug if available
        let url = EMAIL_TEMPLATES_API_ENDPOINT;
        if (companySlug) {
          url += `?company_slug=${companySlug}`;
        }
        
        // Make the request
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Templates GET response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch email templates: ${response.status} ${response.statusText}`);
        }
        
        const data: EmailTemplate[] = await response.json();
        setEmailTemplates(data);
      } catch (error) {
        console.error('Error fetching email templates:', error);
        setTemplateLoadError(error instanceof Error ? error.message : 'Failed to load email templates');
      } finally {
        setIsLoadingTemplates(false);
      }
    };
    
    fetchEmailTemplates();
  }, [companySlug]);
  
  useEffect(() => {
    const fetchEmailConfigs = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        
        console.log('Fetching email configurations from:', EMAIL_CONFIGS_API_ENDPOINT);
        
        // First make an OPTIONS request to handle CORS preflight
        try {
          const optionsResponse = await fetch(EMAIL_CONFIGS_API_ENDPOINT, {
            method: 'OPTIONS',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Request-Method': 'GET',
              'Access-Control-Request-Headers': 'content-type',
            },
          });
          
          console.log('OPTIONS response status:', optionsResponse.status);
        } catch (error) {
          console.warn('OPTIONS request failed, continuing anyway:', error);
        }
        
        // Now make the actual GET request
        const response = await fetch(EMAIL_CONFIGS_API_ENDPOINT, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Don't include credentials for now to avoid CORS issues
          // credentials: 'include',
        });
        
        console.log('GET response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch email configurations: ${response.status} ${response.statusText}`);
        }
        
        const data: EmailConfig[] = await response.json();
        setEmailConfigs(data);
        
        // Select the active configuration by default
        const activeConfig = data.find(config => config.is_active);
        if (activeConfig) {
          setSelectedConfigId(activeConfig.id);
          setFormData(prev => ({
            ...prev,
            from: activeConfig.host_user
          }));
        }
      } catch (error) {
        console.error('Error fetching email configurations:', error);
        setLoadError(error instanceof Error ? error.message : 'Failed to load email configurations');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmailConfigs();
  }, []);

  // Handle configuration selection change
  const handleConfigChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const configId = parseInt(e.target.value);
    setSelectedConfigId(configId);
    
    // Update the from email based on the selected configuration
    const selectedConfig = emailConfigs.find(config => config.id === configId);
    if (selectedConfig) {
      setFormData(prev => ({
        ...prev,
        from: selectedConfig.host_user
      }));
    }
  };

  // Handle template selection change
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = parseInt(e.target.value);
    setSelectedTemplateId(templateId);
    
    if (templateId) {
      // Find the selected template
      const selectedTemplate = emailTemplates.find(template => template.id === templateId);
      if (selectedTemplate) {
        // Update form data with template content
        setFormData(prev => ({
          ...prev,
          subject: selectedTemplate.subject,
          body: selectedTemplate.content
        }));
      }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      // First, ensure we have a CSRF token by making an OPTIONS request
      const csrfResponse = await fetch(EMAIL_API_ENDPOINT, {
        method: 'OPTIONS',
        credentials: 'include',
      });
      
      if (!csrfResponse.ok) {
        throw new Error('Failed to establish secure connection');
      }
      
      // Get CSRF token from cookies
      const csrfToken = getCookie('csrftoken');
      if (!csrfToken) {
        throw new Error('CSRF token not found. Please refresh the page and try again.');
      }
      
      // Now send the actual request
      const response = await fetch(EMAIL_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({
          to: formData.to,
          from: formData.from,
          subject: formData.subject,
          body: formData.body
        }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to send email');
      }
      
      toast({
        title: 'Email sent successfully!',
        description: `Email to ${responseData.to} has been queued for sending.`,
      });
      
      // Reset form but keep the from email
      setFormData(prev => ({
        ...prev,
        to: '',
        subject: '',
        body: ''
      }));
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'Error sending email',
        description: error instanceof Error ? 
          error.message : 
          'There was an error sending your email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Send Email</CardTitle>
          <CardDescription>Compose and send a new email message</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  name="to"
                  type="email"
                  placeholder="recipient@example.com"
                  value={formData.to}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emailConfig">Email Configuration</Label>
                <select
                  id="emailConfig"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedConfigId || ''}
                  onChange={handleConfigChange}
                  disabled={isLoading || emailConfigs.length === 0}
                  required
                >
                  {isLoading ? (
                    <option value="">Loading configurations...</option>
                  ) : emailConfigs.length === 0 ? (
                    <option value="">No configurations available</option>
                  ) : (
                    <>
                      <option value="">Select email configuration</option>
                      {emailConfigs.map(config => (
                        <option key={config.id} value={config.id}>
                          {config.host_user} ({config.host}:{config.port})
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {loadError && <p className="text-red-500 text-sm mt-1">{loadError}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emailTemplate">Email Template</Label>
                <select
                  id="emailTemplate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedTemplateId || ''}
                  onChange={handleTemplateChange}
                  disabled={isLoadingTemplates || emailTemplates.length === 0}
                >
                  {isLoadingTemplates ? (
                    <option value="">Loading templates...</option>
                  ) : emailTemplates.length === 0 ? (
                    <option value="">No templates available</option>
                  ) : (
                    <>
                      <option value="">Select email template</option>
                      {emailTemplates.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.subject} {template.is_global ? '(Global)' : template.company_name ? `(${template.company_name})` : ''}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {templateLoadError && <p className="text-red-500 text-sm mt-1">{templateLoadError}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <Input
                  id="from"
                  name="from"
                  type="email"
                  placeholder="sender@example.com"
                  value={formData.from}
                  onChange={handleChange}
                  required
                  disabled
                  className="bg-gray-100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Email subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="body">Message</Label>
                <Textarea
                  id="body"
                  name="body"
                  placeholder="Write your message here... HTML is supported"
                  rows={8}
                  value={formData.body}
                  onChange={handleChange}
                  required
                  className="min-h-[200px] font-mono text-sm"
                />
                
                {/* HTML Preview */}
                <div className="mt-4">
                  <Label>Message Preview</Label>
                  <div 
                    className="p-4 border rounded-md bg-white mt-1 min-h-[200px] overflow-auto"
                    dangerouslySetInnerHTML={{ __html: formData.body }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSending}>
                {isSending ? 'Sending...' : 'Send Email'}
              </Button>
            </div>
          </form>
        </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Sender;
