import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookiePolicy() {
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
          <h1 className="font-orbitron text-xl font-bold">Cookie Policy</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12 max-w-4xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="font-orbitron">Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: December 2024</p>

          <h2>What Are Cookies</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
            They are widely used to make websites work more efficiently and to provide information to website owners.
          </p>

          <h2>How We Use Cookies</h2>
          <p>
            Tinnie House Records uses cookies to enhance your browsing experience, analyze site traffic, and 
            personalize content. We use both session cookies (which expire when you close your browser) and 
            persistent cookies (which remain on your device for a set period).
          </p>

          <h2>Types of Cookies We Use</h2>
          
          <h3>Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They enable basic functions like 
            page navigation, access to secure areas, and form submissions. The website cannot function properly 
            without these cookies.
          </p>

          <h3>Analytics Cookies</h3>
          <p>
            We use analytics cookies to understand how visitors interact with our website. This helps us improve 
            our site's performance and user experience. These cookies collect information about:
          </p>
          <ul>
            <li>Number of visitors</li>
            <li>Pages visited</li>
            <li>Time spent on each page</li>
            <li>Traffic sources</li>
            <li>Error messages encountered</li>
          </ul>

          <h3>Functional Cookies</h3>
          <p>
            These cookies enable enhanced functionality and personalization, such as:
          </p>
          <ul>
            <li>Remembering your theme preferences (dark/light mode)</li>
            <li>Language settings</li>
            <li>Music player preferences</li>
            <li>Form data to improve user experience</li>
          </ul>

          <h3>Marketing Cookies</h3>
          <p>
            These cookies are used to track visitors across websites to display relevant advertisements. 
            They may be set by our advertising partners to build a profile of your interests.
          </p>

          <h2>Third-Party Cookies</h2>
          <p>
            Our website may also use third-party cookies from services such as:
          </p>
          <ul>
            <li>Google Analytics (for website analytics)</li>
            <li>Social media platforms (Facebook, Twitter, Instagram)</li>
            <li>Music streaming platforms (SoundCloud, Beatport)</li>
            <li>Content delivery networks</li>
          </ul>

          <h2>Managing Cookies</h2>
          <p>
            You can control and manage cookies in various ways:
          </p>

          <h3>Browser Settings</h3>
          <p>
            Most web browsers allow you to control cookies through their settings. You can:
          </p>
          <ul>
            <li>Block all cookies</li>
            <li>Block third-party cookies only</li>
            <li>Delete cookies when you close your browser</li>
            <li>Allow cookies from specific websites</li>
          </ul>

          <h3>Browser-Specific Instructions</h3>
          <ul>
            <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
            <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
            <li><strong>Edge:</strong> Settings → Site permissions → Cookies and site data</li>
          </ul>

          <h2>Impact of Disabling Cookies</h2>
          <p>
            If you choose to disable cookies, some features of our website may not work properly:
          </p>
          <ul>
            <li>Theme preferences may not be saved</li>
            <li>Music player settings may reset</li>
            <li>Contact forms may not function correctly</li>
            <li>Analytics data will not be collected</li>
          </ul>

          <h2>Cookie Consent</h2>
          <p>
            By continuing to use our website, you consent to our use of cookies as described in this policy. 
            You can withdraw your consent at any time by adjusting your browser settings or contacting us.
          </p>

          <h2>Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in our practices or for 
            legal reasons. We will notify users of any significant changes by posting the updated policy 
            on our website.
          </p>

          <h2>More Information</h2>
          <p>
            For more information about cookies, you can visit:
          </p>
          <ul>
            <li><a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">All About Cookies</a></li>
            <li><a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer">Your Online Choices</a></li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, please contact us at:
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