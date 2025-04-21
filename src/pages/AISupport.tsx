
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, FileText, BrainCircuit, FileImage } from 'lucide-react';
import PhishingTopicSuggester from '@/components/ai/PhishingTopicSuggester';
import ReportInsightsAnalyzer from '@/components/ai/ReportInsightsAnalyzer';
import PhishingIdeaGenerator from '@/components/ai/PhishingIdeaGenerator';

const AISupport = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow bg-gray-50 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Bot className="h-6 w-6 text-phish-600" />
                <h1 className="text-2xl font-bold">AI Support</h1>
              </div>
              <p className="text-gray-600">Get AI-powered assistance for your phishing awareness campaigns</p>
            </div>
          </div>
          
          {/* AI Tools */}
          <Tabs defaultValue="suggestions" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto mb-6 grid-cols-3">
              <TabsTrigger value="suggestions" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Campaign Suggestions</span>
              </TabsTrigger>
              <TabsTrigger value="generator" className="flex items-center gap-1">
                <FileImage className="h-4 w-4" />
                <span>Idea Generator</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-1">
                <BrainCircuit className="h-4 w-4" />
                <span>Report Insights</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="suggestions">
              <div className="grid grid-cols-1 gap-6">
                <PhishingTopicSuggester />
                
                <Card className="border-gray-100">
                  <CardHeader>
                    <CardTitle>How to use AI campaign suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-4 text-gray-600">
                      <li className="flex gap-2">
                        <span className="font-medium text-phish-600">1.</span>
                        <p>Browse pre-defined templates by department or create a custom scenario</p>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium text-phish-600">2.</span>
                        <p>Select a phishing scenario that best matches your training goals</p>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium text-phish-600">3.</span>
                        <p>Copy the scenario details and use them as a starting point for your campaign</p>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium text-phish-600">4.</span>
                        <p>Navigate to the Templates section to create your email based on the suggestion</p>
                      </li>
                    </ol>
                    
                    <div className="mt-6">
                      <Button asChild className="bg-phish-600 hover:bg-phish-700">
                        <a href="/templates">Create Campaign from Suggestion</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="generator">
              <div className="grid grid-cols-1 gap-6">
                <PhishingIdeaGenerator />
                
                <Card className="border-gray-100">
                  <CardHeader>
                    <CardTitle>How to use AI idea generator</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-4 text-gray-600">
                      <li className="flex gap-2">
                        <span className="font-medium text-phish-600">1.</span>
                        <p>Select your target audience from the available options</p>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium text-phish-600">2.</span>
                        <p>Add any specific context or requirements for your campaign</p>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium text-phish-600">3.</span>
                        <p>Generate a tailored phishing scenario and matching poster</p>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-medium text-phish-600">4.</span>
                        <p>Use the generated content in your email template design</p>
                      </li>
                    </ol>
                    
                    <div className="mt-6">
                      <Button asChild className="bg-phish-600 hover:bg-phish-700">
                        <a href="/templates">Create Campaign from Generated Idea</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="insights">
              <div className="grid grid-cols-1 gap-6">
                <ReportInsightsAnalyzer />
                
                <Card className="border-gray-100">
                  <CardHeader>
                    <CardTitle>Understanding AI insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Our AI analyzes your campaign results to identify patterns, vulnerabilities, and improvement opportunities.
                      The insights are based on:
                    </p>
                    
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium text-xs mt-0.5">1</div>
                        <p><span className="font-medium">Click rates by department</span> - Identifies which teams need additional training</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium text-xs mt-0.5">2</div>
                        <p><span className="font-medium">Campaign effectiveness</span> - Determines which phishing scenarios are most likely to deceive users</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium text-xs mt-0.5">3</div>
                        <p><span className="font-medium">Reporting behavior</span> - Analyzes how quickly and frequently users report suspicious emails</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium text-xs mt-0.5">4</div>
                        <p><span className="font-medium">Historical trends</span> - Compares current performance against past campaigns to measure improvement</p>
                      </li>
                    </ul>
                    
                    <div className="mt-6">
                      <Button asChild className="bg-phish-600 hover:bg-phish-700">
                        <a href="/analytics">View Full Analytics</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AISupport;
