import useContactForm from "../hooks/useContactForm";
import { handleContactSubmit } from "../handlers/contactHandlers";

export default function Contact() {
  const { formData, handleChange } = useContactForm();

  const renderInput = (label, name, type = "text") => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-black mb-2">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        required
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#D8EDC2] py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">Get in touch with Me</p>
        </div>

        <div className="grid md:grid-cols-2 gap-y-6">
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Get in Touch</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-black mb-2">Email</h3>
                <p className="text-gray-600">xprojectyworkz@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <form onSubmit={(e) => handleContactSubmit(e, formData)} className="space-y-6">
              {renderInput("Name", "name")}
              {renderInput("Email", "email", "email")}
              {renderInput("Subject", "subject")}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
