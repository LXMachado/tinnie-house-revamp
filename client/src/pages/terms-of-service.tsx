import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
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
          <h1 className="font-orbitron text-xl font-bold">Terms of Service</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12 max-w-4xl">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="font-orbitron">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: December 2024</p>

          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using the Tinnie House Records website and services, you accept and agree to be bound by 
            the terms and provision of this agreement. If you do not agree to abide by the above, please do not use 
            this service.
          </p>

          <h2>Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on Tinnie House Records' website 
            for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, 
            and under this license you may not:
          </p>
          <ul>
            <li>modify or copy the materials</li>
            <li>use the materials for any commercial purpose or for any public display</li>
            <li>attempt to reverse engineer any software contained on the website</li>
            <li>remove any copyright or other proprietary notations from the materials</li>
          </ul>

          <h2>Music Content and Copyright</h2>
          <p>
            All music, artwork, and related content distributed by Tinnie House Records is protected by copyright and 
            other intellectual property laws. Unauthorized reproduction, distribution, or public performance of our 
            content is strictly prohibited.
          </p>

          <h3>Demo Submissions</h3>
          <p>
            By submitting music demos or other content to Tinnie House Records, you represent and warrant that:
          </p>
          <ul>
            <li>You own or have the necessary rights to the submitted content</li>
            <li>The content does not infringe on any third-party rights</li>
            <li>You grant us the right to review and potentially distribute your content</li>
            <li>Submissions are made at your own risk and expense</li>
          </ul>

          <h2>User Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current 
            at all times. You are responsible for safeguarding the password and for all activities that occur under 
            your account.
          </p>

          <h2>Prohibited Uses</h2>
          <p>You may not use our service:</p>
          <ul>
            <li>For any unlawful purpose or to solicit others to unlawful acts</li>
            <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
            <li>To upload or transmit viruses or any other type of malicious code</li>
          </ul>

          <h2>Third-Party Services</h2>
          <p>
            Our website may contain links to third-party websites or services (such as Beatport, SoundCloud, etc.) 
            that are not owned or controlled by Tinnie House Records. We have no control over and assume no 
            responsibility for the content, privacy policies, or practices of any third-party websites or services.
          </p>

          <h2>Disclaimer</h2>
          <p>
            The materials on Tinnie House Records' website are provided on an 'as is' basis. Tinnie House Records 
            makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, 
            without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, 
            or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2>Limitations</h2>
          <p>
            In no event shall Tinnie House Records or its suppliers be liable for any damages (including, without 
            limitation, damages for loss of data or profit, or due to business interruption) arising out of the use 
            or inability to use the materials on our website, even if we or our authorized representative has been 
            notified orally or in writing of the possibility of such damage.
          </p>

          <h2>Accuracy of Materials</h2>
          <p>
            The materials appearing on our website could include technical, typographical, or photographic errors. 
            We do not warrant that any of the materials on its website are accurate, complete, or current. We may 
            make changes to the materials contained on its website at any time without notice.
          </p>

          <h2>Modifications</h2>
          <p>
            We may revise these terms of service at any time without notice. By using this website, you are agreeing 
            to be bound by the then current version of these terms of service.
          </p>

          <h2>Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of Australia, 
            and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
          </p>

          <h2>Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
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