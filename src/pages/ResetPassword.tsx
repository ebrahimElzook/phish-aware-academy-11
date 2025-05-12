
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to request password reset
    setTimeout(() => {
      toast({
        title: "تم إرسال رابط إعادة تعيين كلمة المرور",
        description: "تحقق من بريدك الإلكتروني للحصول على تعليمات إعادة تعيين كلمة المرور",
      });
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/876a553e-d478-4016-a8f0-1580f492ca19.png" 
            alt="CSWORD Logo" 
            className="h-12 mx-auto mb-4" 
          />
          <h1 className="text-3xl font-bold">إعادة تعيين كلمة المرور</h1>
          <p className="text-gray-500 mt-2">أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>استعادة كلمة المرور</CardTitle>
            <CardDescription>
              سنرسل لك رابطاً عبر البريد الإلكتروني لإعادة تعيين كلمة المرور
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="ادخل بريدك الإلكتروني" 
                      className="pl-10" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#907527] hover:bg-[#705b1e]"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      جاري المعالجة...
                    </span>
                  ) : (
                    "إرسال رابط إعادة التعيين"
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-green-50 text-green-700 p-4 rounded-md">
                  <p className="font-medium">تم إرسال البريد الإلكتروني</p>
                  <p className="text-sm mt-1">
                    تم إرسال رابط إعادة تعيين كلمة المرور إلى {email}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  لم تتلق البريد الإلكتروني؟ تحقق من مجلد البريد المزعج أو{' '}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-[#907527]"
                    onClick={() => setSubmitted(false)}
                  >
                    أعد المحاولة
                  </Button>
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              العودة لصفحة تسجيل الدخول
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
