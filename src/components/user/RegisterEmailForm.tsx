"use client";

import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Zod schema for email validation
const registrationSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

const RegisterEmailForm: React.FC = () => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: { email: string }) => {
    setSuccess('');
    setError('');

    try {
      const response = await api.post('/api/v1/users/register-email', { email: data.email });
      setSuccess(response.data.message);
      const token = response.data.data.token;
      localStorage.setItem('emailToken', token);
      localStorage.setItem('email', data.email);
      form.reset(); // Reset form fields
      router.push('/user/verify-email'); // Redirect to verification page
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to register email. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-6 rounded shadow-md w-80"
        >
          <h2 className="text-2xl font-bold text-center mb-4 text-blue-500">Register Your Email</h2>

          {/* Email Field */}
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Email:</FormLabel> */}
                <FormControl>
                  <Input
                    className='placeholder:text-slate-400'
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Success and Error Messages */}
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {success && <p className="text-green-500 mb-2">{success}</p>}

          {/* Submit Button */}
          <Button
            type="submit"
            className="bg-blue-500 text-white rounded my-5 p-2 w-full hover:bg-blue-600"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterEmailForm;
