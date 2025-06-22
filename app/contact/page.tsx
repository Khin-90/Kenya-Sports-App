"use client";
import { NextPage } from 'next';
import Head from 'next/head';
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const ContactUs: NextPage = () => {
  return (
    <>
      <Head>
        <title>Contact Us | Kenyan Sports Scouting</title>
        <meta name="description" content="Get in touch with our sports scouting team" />
      </Head>
      
      <Navbar />
      
      <div className="contact-container">
        <div className="contact-card">
          <div className="contact-header">
            <h1>Contact Our Scouting Team</h1>
            <p>
              Have questions about player evaluations or our scouting process? Reach out to our team.
            </p>
          </div>

          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
              >
                <option>Player Evaluation Request</option>
                <option>Scouting Inquiry</option>
                <option>Technical Support</option>
                <option>Partnership Opportunity</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
              ></textarea>
            </div>

            <div className="form-submit">
              <button type="submit">
                Send Message
              </button>
            </div>
          </form>

          <div className="contact-alternatives">
            <h2>Other Ways to Reach Us</h2>
            <div className="contact-methods">
              <div className="contact-method">
                <div className="contact-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="contact-detail">
                  <p>scouting@kenyansportsscouting.com</p>
                </div>
              </div>
              <div className="contact-method">
                <div className="contact-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="contact-detail">
                  <p>+254 700 123 456</p>
                </div>
              </div>
              <div className="contact-method">
                <div className="contact-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="contact-detail">
                  <p>Nairobi, Kenya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

      <style jsx>{`
        .contact-container {
          min-height: 100vh;
          padding: 3rem 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .contact-card {
          width: 100%;
          max-width: 600px;
          padding: 2rem;
          border-radius: 8px;
        }
        
        .contact-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .contact-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-group label {
          font-weight: 500;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 100%;
        }
        
        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }
        
        .form-submit button {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .contact-alternatives {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #eee;
        }
        
        .contact-alternatives h2 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }
        
        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .contact-method {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .contact-icon svg {
          width: 24px;
          height: 24px;
        }
        
        @media (min-width: 768px) {
          .contact-card {
            padding: 2.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default ContactUs;