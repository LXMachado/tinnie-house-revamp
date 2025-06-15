import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="font-orbitron text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: June 15, 2025</p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="font-orbitron text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using the Tinnie House Records website, you accept and agree to be bound by 
              the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-orbitron text-2xl font-semibold mb-4">2. Use of Website</h2>
            <p className="mb-4">
              You may use our website for lawful purposes only. You agree not to use the website in any way 
              that could damage, disable, overburden, or impair our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-orbitron text-2xl font-semibold mb-4">3. Intellectual Property</h2>
            <p className="mb-4">
              All content on this website, including but not limited to music, artwork, text, and logos, 
              is the property of Tinnie House Records or its licensors and is protected by copyright laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-orbitron text-2xl font-semibold mb-4">4. Music Submissions</h2>
            <p className="mb-4">
              When you submit music or other materials to us:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>You retain ownership of your original work</li>
              <li>You grant us permission to review and consider your submission</li>
              <li>You represent that you have the right to submit the material</li>
              <li>We are not obligated to respond to or sign any submission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-orbitron text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
            <p className="mb-4">
              Tinnie House Records shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages arising out of your use of the website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-orbitron text-2xl font-semibold mb-4">6. Modifications</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. Changes will be posted on this page 
              with an updated revision date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-orbitron text-2xl font-semibold mb-4">7. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us through our 
              website's contact form.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}