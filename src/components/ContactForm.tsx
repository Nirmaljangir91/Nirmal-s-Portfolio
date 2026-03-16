import { ChangeEvent, FormEvent, useState } from "react";
import "./styles/ContactForm.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const subject = encodeURIComponent(
      formData.subject || `Portfolio inquiry from ${formData.name}`
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );

    window.location.href = `mailto:jangirsarwan91@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section className="contact-form-section section-container">
      <div className="contact-form-copy">
        <p className="contact-form-eyebrow">Let&apos;s Connect</p>
        <h2>Have an idea, project, or collaboration in mind?</h2>
        <p>
          Send me a message and I&apos;ll get back to you through email.
        </p>
      </div>

      <form className="contact-form-card" onSubmit={handleSubmit}>
        <div className="contact-form-grid">
          <label className="contact-form-field">
            <span>Name</span>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="contact-form-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <label className="contact-form-field">
          <span>Subject</span>
          <input
            type="text"
            name="subject"
            placeholder="Project discussion"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </label>

        <label className="contact-form-field">
          <span>Message</span>
          <textarea
            name="message"
            rows={6}
            placeholder="Tell me a bit about your idea..."
            value={formData.message}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="contact-form-button">
          Send Message
        </button>
      </form>
    </section>
  );
};

export default ContactForm;
