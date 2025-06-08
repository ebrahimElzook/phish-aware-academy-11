
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Code, Type } from 'lucide-react';
import { RichTextEditor } from '@/components/template/RichTextEditor';
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from '@/hooks/use-mobile';

const TemplateEditor = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("content");

  // Handle back button navigation
  const handleBackToTemplates = () => {
    const path = window.location.pathname;
    const parts = path.split('/');
    const companySlug = parts[1];
    navigate(`/${companySlug}/templates`);
  };

  const [editorMode, setEditorMode] = useState<'html' | 'richText'>('html');
  const [template, setTemplate] = useState({
    name: "",
    difficulty: "medium",
    subject: "Important: Your Account Security Requires Attention",
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="text-align: center; padding-bottom: 20px;">
    <img src="https://via.placeholder.com/150x50" alt="Company Logo" style="max-width: 150px;">
  </div>
  
  <div style="background-color: #f7f7f7; border-left: 4px solid #d63031; padding: 15px; margin-bottom: 20px;">
    <p style="margin: 0; font-weight: bold; color: #d63031;">URGENT: Action Required</p>
  </div>
  
  <p>Dear ${"recipient.name"},</p>
  
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

  const PreviewPane = () => (
    <Card className="border-gray-100 h-full">
      <CardHeader className="border-b border-gray-100 bg-gray-50">
        <CardTitle className="text-lg">Message Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="font-medium">Subject:</span>
            <span>{template.subject}</span>
          </div>
        </div>
        <div className="p-4">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: template.body }} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={handleBackToTemplates}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Button>
          <Button size="sm" onClick={handleSaveTemplate}>
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Template Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value="content" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Template Name</Label>
                        <Input
                          id="name"
                          value={template.name}
                          onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                          placeholder="Enter template name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Difficulty</Label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              className="h-4 w-4 text-blue-600"
                              checked={template.difficulty === "easy"}
                              onChange={() => setTemplate({ ...template, difficulty: "easy" })}
                            />
                            <span className="ml-2">Easy</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              className="h-4 w-4 text-blue-600"
                              checked={template.difficulty === "medium"}
                              onChange={() => setTemplate({ ...template, difficulty: "medium" })}
                            />
                            <span className="ml-2">Medium</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              className="h-4 w-4 text-blue-600"
                              checked={template.difficulty === "hard"}
                              onChange={() => setTemplate({ ...template, difficulty: "hard" })}
                            />
                            <span className="ml-2">Hard</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={template.subject}
                          onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
                          placeholder="Enter email subject"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Email Content</Label>
                          <ToggleGroup 
                            type="single" 
                            value={editorMode}
                            onValueChange={(value) => value && setEditorMode(value as 'html' | 'richText')}
                            className="h-8"
                          >
                            <ToggleGroupItem value="html" className="text-xs px-3">
                              <Code className="h-3.5 w-3.5 mr-1" />
                              HTML
                            </ToggleGroupItem>
                            <ToggleGroupItem value="richText" className="text-xs px-3">
                              <Type className="h-3.5 w-3.5 mr-1" />
                              Rich Text
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                        
                        {editorMode === 'html' ? (
                          <div className="space-y-2">
                            <Textarea
                              className="w-full min-h-[400px] p-3 font-mono text-sm"
                              value={template.body}
                              onChange={(e) => setTemplate({ ...template, body: e.target.value })}
                              placeholder="Enter your HTML content here..."
                            />
                            <p className="text-xs text-gray-500">
                              Edit the HTML directly. Switch to Rich Text for a visual editor.
                            </p>
                          </div>
                        ) : (
                          <div className="border rounded-md">
                            <RichTextEditor 
                              content={template.body} 
                              onChange={(content) => setTemplate({ ...template, body: content })} 
                            />
                            <p className="text-xs text-gray-500 p-2 border-t bg-gray-50">
                              Use the toolbar to format your content. Switch to HTML for direct code editing.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <PreviewPane />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
