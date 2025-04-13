
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Mail, User, Briefcase, Calendar, Globe, Edit, Eye, Save, FileText, Copy, ArrowLeft, Send } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MailTemplateEditor from '@/components/template/MailTemplateEditor';

const TemplateEditor = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("content");
  const [template, setTemplate] = useState({
    subject: "Important: Your Account Security Requires Attention",
    sender: "security@orgname.com",
    senderName: "IT Security Team",
    recipient: "${recipient.email}",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="text-align: center; padding-bottom: 20px;">
    <img src="https://via.placeholder.com/150x50" alt="Company Logo" style="max-width: 150px;">
  </div>
  
  <div style="background-color: #f7f7f7; border-left: 4px solid #d63031; padding: 15px; margin-bottom: 20px;">
    <p style="margin: 0; font-weight: bold; color: #d63031;">URGENT: Action Required</p>
  </div>
  
  <p>Dear ${"{recipient.name}"},</p>
  
  <p>Our security system has detected unusual login attempts on your account. To ensure your account remains secure, please verify your identity by clicking the button below.</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="#" style="background-color: #0984e3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Account Now</a>
  </div>
  
  <p>If you did not attempt to log in, please reset your password immediately by clicking the button above.</p>
  
  <p>For security reasons, this link will expire in 24 hours.</p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
  
  <p style="font-size: 12px; color: #777;">This is an automated message from the IT Security department. Please do not reply directly to this email. If you need assistance, please contact the help desk at support@orgname.com.</p>
  
  <p style="font-size: 12px; color: #777;">© 2025 Your Organization. All rights reserved.</p>
</div>`,
  });

  const handleSaveTemplate = () => {
    toast({
      title: "Template Saved",
      description: "Your email template has been saved successfully.",
    });
  };

  const handleSendTest = () => {
    toast({
      title: "Test Email Sent",
      description: "A test email has been sent to your address.",
    });
  };

  const PreviewPane = () => (
    <Card className="border-gray-100 h-full">
      <CardHeader className="border-b border-gray-100 bg-gray-50">
        <CardTitle className="text-lg">Email Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-medium">From:</span>
            <span>{template.senderName} &lt;{template.sender}&gt;</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="font-medium">To:</span>
            <span>{template.recipient}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Subject:</span>
            <span>{template.subject}</span>
          </div>
        </div>
        <div className="p-4">
          <div dangerouslySetInnerHTML={{ __html: template.body }} />
        </div>
      </CardContent>
    </Card>
  );

  // Use Dialog for desktop, Drawer for mobile
  const PreviewDialog = () => {
    const DialogComponent = isMobile ? Drawer : Dialog;
    const DialogContentComponent = isMobile ? DrawerContent : DialogContent;
    const DialogHeaderComponent = isMobile ? DrawerHeader : DialogHeader;
    const DialogTitleComponent = isMobile ? DrawerTitle : DialogTitle;
    const DialogDescriptionComponent = isMobile ? DrawerDescription : DialogDescription;
    const DialogFooterComponent = isMobile ? DrawerFooter : DialogFooter;
    const DialogCloseComponent = isMobile ? DrawerClose : DialogClose;
    const DialogTriggerComponent = isMobile ? DrawerTrigger : DialogTrigger;

    return (
      <DialogComponent>
        <DialogTriggerComponent asChild>
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </Button>
        </DialogTriggerComponent>
        <DialogContentComponent className="sm:max-w-[700px]">
          <DialogHeaderComponent>
            <DialogTitleComponent>Email Preview</DialogTitleComponent>
            <DialogDescriptionComponent>
              This is how your email will appear to recipients.
            </DialogDescriptionComponent>
          </DialogHeaderComponent>
          <div className="border rounded-md overflow-hidden my-4">
            <div className="p-4 border-b bg-gray-50">
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">From:</span>
                  <span>{template.senderName} &lt;{template.sender}&gt;</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">To:</span>
                  <span>{template.recipient}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Subject:</span>
                  <span>{template.subject}</span>
                </div>
              </div>
            </div>
            <div className="p-4 max-h-[400px] overflow-y-auto">
              <div dangerouslySetInnerHTML={{ __html: template.body }} />
            </div>
          </div>
          <DialogFooterComponent>
            <Button variant="outline" className="gap-2" onClick={handleSendTest}>
              <Send className="h-4 w-4" />
              <span>Send Test Email</span>
            </Button>
          </DialogFooterComponent>
        </DialogContentComponent>
      </DialogComponent>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="mr-4" 
              onClick={() => navigate('/templates')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold mb-1">Email Template Editor</h1>
              <p className="text-gray-600">Design and customize your phishing simulation email</p>
            </div>
          </div>

          {/* Editor */}
          <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white border border-gray-100 w-full">
              <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
              <TabsTrigger value="design" className="flex-1">Design Email</TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Email Settings & Editor */}
                <div className="lg:col-span-2">
                  <Card className="border-gray-100">
                    <CardHeader className="border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <CardTitle>Email Template</CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" className="gap-2" onClick={handleSaveTemplate}>
                            <Save className="h-4 w-4" />
                            <span>Save</span>
                          </Button>
                          <PreviewDialog />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="edit" value={activeTab === "content" ? "edit" : "code"} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                          <TabsTrigger value="edit" className="gap-1">
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </TabsTrigger>
                          <TabsTrigger value="code" className="gap-1">
                            <FileText className="h-4 w-4" />
                            <span>HTML</span>
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="edit" className="space-y-4 mt-2">
                          <div className="grid gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="subject">Email Subject</Label>
                              <Input 
                                id="subject" 
                                placeholder="Enter subject line" 
                                value={template.subject}
                                onChange={(e) => setTemplate({...template, subject: e.target.value})}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="sender">Sender Email</Label>
                                <Input 
                                  id="sender" 
                                  placeholder="sender@example.com" 
                                  value={template.sender}
                                  onChange={(e) => setTemplate({...template, sender: e.target.value})}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="senderName">Sender Name</Label>
                                <Input 
                                  id="senderName" 
                                  placeholder="Company Name" 
                                  value={template.senderName}
                                  onChange={(e) => setTemplate({...template, senderName: e.target.value})}
                                />
                              </div>
                            </div>
                            
                            <div className="grid gap-2">
                              <Label htmlFor="emailBody">Email Content</Label>
                              <Textarea 
                                id="emailBody" 
                                placeholder="Enter your email body text"
                                className="min-h-[300px] font-mono text-sm"
                                value={template.body}
                                onChange={(e) => setTemplate({...template, body: e.target.value})}
                              />
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="code">
                          <Textarea 
                            id="htmlCode" 
                            placeholder="Enter HTML code"
                            className="min-h-[400px] font-mono text-sm"
                            value={template.body}
                            onChange={(e) => setTemplate({...template, body: e.target.value})}
                          />
                        </TabsContent>
                      </Tabs>
                      
                    </CardContent>
                  </Card>
                </div>
                
                {/* Right Column - Preview & Variables */}
                <div className="space-y-6">
                  {/* Preview */}
                  {activeTab === "edit" && !isMobile && <PreviewPane />}
                  
                  {/* Variables */}
                  <Card className="border-gray-100">
                    <CardHeader className="border-b border-gray-100">
                      <CardTitle>Template Variables</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="p-4">
                        <p className="text-gray-600 text-sm mb-4">
                          Use these variables in your template to personalize the email for each recipient.
                        </p>
                        <div className="space-y-3">
                          <VariableItem icon={<User className="h-4 w-4" />} name="recipient.name" desc="Recipient's full name" />
                          <VariableItem icon={<Mail className="h-4 w-4" />} name="recipient.email" desc="Recipient's email address" />
                          <VariableItem icon={<Briefcase className="h-4 w-4" />} name="recipient.department" desc="Recipient's department" />
                          <VariableItem icon={<Globe className="h-4 w-4" />} name="company.name" desc="Company name" />
                          <VariableItem icon={<Calendar className="h-4 w-4" />} name="date.current" desc="Current date" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Tips */}
                  <Card className="border-gray-100">
                    <CardHeader className="border-b border-gray-100">
                      <CardTitle>Template Design Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Use a professional tone to mimic legitimate emails</li>
                        <li>• Create a sense of urgency to encourage clicks</li>
                        <li>• Include company branding elements</li>
                        <li>• Keep formatting simple and clean</li>
                        <li>• Include a clear call-to-action</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="design">
              <MailTemplateEditor />
            </TabsContent>
            
            <TabsContent value="settings">
              <Card className="border-gray-100">
                <CardHeader>
                  <CardTitle>Template Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="templateName">Template Name</Label>
                      <Input id="templateName" placeholder="Enter a name for this template" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Enter a description for this template" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <select id="category" className="w-full rounded-md border border-gray-300 p-2">
                        <option value="account-security">Account Security</option>
                        <option value="financial">Financial</option>
                        <option value="document-share">Document Sharing</option>
                        <option value="promotional">Promotional</option>
                        <option value="business">Business</option>
                      </select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <select id="difficulty" className="w-full rounded-md border border-gray-300 p-2">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Small helper components
const VariableItem = ({ icon, name, desc }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(`\${${name}}`);
  };
  
  return (
    <div className="flex items-center justify-between py-2 px-1 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2">
        <div className="text-gray-500">{icon}</div>
        <div>
          <p className="text-sm font-medium">${"{" + name + "}"}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleCopy}>
        <Copy className="h-4 w-4" />
        <span className="sr-only">Copy</span>
      </Button>
    </div>
  );
};

export default TemplateEditor;
