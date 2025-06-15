import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b backdrop-blur-md bg-background/80">
        <div className="container flex h-16 items-center">
          <Link href="/">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="font-orbitron text-xl font-bold">Privacy Policy</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12 max-w-4xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="font-orbitron">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: December 2024</p>

          <h2>Introduction</h2>
          <p>
            Tinnie House Records ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
            or use our services.
          </p>

          <h2>Information We Collect</h2>
          <h3>Personal Information</h3>
          <ul>
            <li>Contact information (name, email address, phone number)</li>
            <li>Demographic information</li>
            <li>Music preferences and listening habits</li>
            <li>Demo submissions and related content</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <ul>
            <li>IP address and browser information</li>
            <li>Device information and operating system</li>
            <li>Website usage data and analytics</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the collected information for:</p>
          <ul>
            <li>Providing and improving our services</li>
            <li>Communicating with you about releases and updates</li>
            <li>Processing demo submissions</li>
            <li>Analyzing website usage and performance</li>
            <li>Marketing and promotional activities (with consent)</li>
            <li>Legal compliance and fraud prevention</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Service providers and business partners</li>
            <li>Music distribution platforms (Beatport, SoundCloud, etc.)</li>
            <li>Legal authorities when required by law</li>
            <li>Third parties in case of business transfer</li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over 
            the internet is 100% secure.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your personal information</li>
            <li>Object to processing</li>
            <li>Data portability</li>
            <li>Withdraw consent</li>
          </ul>

          <h2>Cookies</h2>
          <p>
            We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, 
            and personalize content. You can control cookies through your browser settings.
          </p>

          <h2>International Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your country of residence. 
            We ensure appropriate safeguards are in place for such transfers.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            Our services are not directed to children under 13. We do not knowingly collect personal information 
            from children under 13. If you become aware that a child has provided us with personal information, 
            please contact us.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
            the new Privacy Policy on this page with an updated "Last updated" date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <ul>
            <li>Email: info@tinniehouserecords.com</li>
            <li>Address: Gold Coast, Australia</li>
          </ul>
        </div>
      </div>
    </div>
  );
}