import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { EMAIL_API_ENDPOINT } from '@/config';
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
  
  const [formData, setFormData] = useState({
    to: '',
    from: 'dangerebrahim@gmail.com', // Pre-fill the from email
    subject: '',
    body: ''
  });
  const [isSending, setIsSending] = useState(false);

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
                  placeholder="Write your message here..."
                  rows={8}
                  value={formData.body}
                  onChange={handleChange}
                  required
                  className="min-h-[200px]"
                />
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
