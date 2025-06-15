import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookiePolicy() {
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
          <h1 className="font-orbitron text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: June 15, 2025</p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="font-orbitron text-2xl font-semibold mb-4">1. What Are Cookies</h2>
            <p className="mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you visit 
              our website. They help us provide you with a better experience by remembering your preferences 
              and settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-orbitron text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
            <p className="mb-4">We use cookies to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Remember your theme preferences (dark/light mode)</li>
              <li>Improve website performance and functionality</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Provide personalized content and features</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-orbitron text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
            
            <div className="mb-6">
              <h3 className="font-orbitron text-xl font-semibold mb-2">Essential Cookies</h3>
              <p className="mb-4">
                These cookies are necessary for the website to function properly and cannot be disabled.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-orbitron text-xl font-semibold mb-2">Preference Cookies</h3>
              <p className="mb-4">
                These cookies remember your settings and preferences, such as your theme choice.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-orbitron text-xl font-semibold mb-2">Analytics Cookies</h3>
              <p className="mb-4">
                These cookies help us understand how visitors interact with our website by collecting 
                anonymous information.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-orbitron text-2xl font-semibold mb-4">4. Managing Cookies</h2>
            <p className="mb-4">
              You can control and manage cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>View and delete cookies</li>
              <li>Block cookies from specific sites</li>
              <li>Block all cookies</li>
              <li>Set preferences for cookie acceptance</li>
            </ul>
            <p className="mb-4">
              Please note that disabling cookies may affect the functionality of our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-orbitron text-2xl font-semibold mb-4">5. Third-Party Cookies</h2>
            <p className="mb-4">
              We may use third-party services that place cookies on your device. These services have their 
              own privacy policies and cookie practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-orbitron text-2xl font-semibold mb-4">6. Updates to This Policy</h2>
            <p className="mb-4">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page 
              with an updated revision date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-orbitron text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about our use of cookies, please contact us through our website's 
              contact form.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}