import React from "react";
import Layout from "../components/layout/Layout";

const Contact = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-900/50 via-green-900/40 to-teal-800/50" />

        <div className="container mx-auto px-4 py-24 text-white text-center relative z-10">
          <div className="max-w-3xl mx-auto animate-fadeInUp">
            <span className="inline-block px-3 py-1 text-sm rounded-full bg-white/20 font-medium backdrop-blur">
              We're here to help
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
              Contact <span className="text-emerald-300">GreenFeather</span>
            </h1>
            <p className="mt-3 text-lg opacity-90">
              Friendly, fast support for all your eco-shopping needs.
            </p>
          </div>

          {/* Quick Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                img: "https://img.icons8.com/fluency/48/000000/email.png",
                title: "General Inquiries",
                desc: "We reply within 24 hours.",
                link: "mailto:support@greenfeather.com",
              },
              {
                img: "https://img.icons8.com/fluency/48/000000/chat.png",
                title: "Live Chat",
                desc: "Mon–Fri, 9am–6pm (GMT).",
                button: "Start Chat",
              },
              {
                img: "https://cdn-icons-png.flaticon.com/512/833/833524.png",
                title: "Orders & Returns",
                desc: "Help with tracking, exchanges, and refunds.",
                link: "#order-help",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/20 backdrop-blur-md flex flex-col items-center text-center p-6 animate-fadeInUp"
              >
                <img src={item.img} alt={item.title} className="w-12 h-12 mb-2" />
                <h3 className="mt-2 font-semibold text-gray-800">{item.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                {item.link && (
                  <a
                  href={item.link}
                  className="mt-3 text-emerald-300 font-medium hover:text-white hover:underline transition"
                >
                  {item.title === "Orders & Returns" ? "Visit Help Center" : item.link.replace("mailto:", "")}
                </a>
                )}
                {item.button && (
                  <button className="mt-3 text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition">
                    {item.button}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Image */}
      <section className="relative py-20 bg-emerald-50/60">
  <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
    {/* Image */}
    <div className="hidden md:block">
      <img
        src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80"
        alt="Professional Support"
        className="rounded-2xl shadow-lg animate-fadeInLeft"
      />
    </div>

    {/* Form */}
    <div className="bg-white rounded-2xl p-10 animate-fadeInRight">
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Send us a message</h2>
      <p className="text-gray-600 mb-6">Fill out the form below and we’ll get back to you promptly.</p>
      <form className="space-y-5">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-emerald-400 py-2 px-0 text-gray-800 placeholder-gray-400 focus:outline-none transition"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-emerald-400 py-2 px-0 text-gray-800 placeholder-gray-400 focus:outline-none transition"
        />
        <textarea
          rows="5"
          placeholder="Your Message"
          className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-emerald-400 py-2 px-0 text-gray-800 placeholder-gray-400 focus:outline-none transition resize-none"
        ></textarea>
        <button className="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-emerald-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300">
        Send Message
      </button>

      </form>
    </div>
  </div>
</section>


<section className="container mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
  {[
    {
      title: "Customer Care",
      icon: "📧",
      content: (
        <>
          <span className="block">support@greenfeather.com</span>
          <span className="block mt-1">+1 (800) 123-4567</span>
          <a
            href="mailto:support@greenfeather.com"
            className="mt-2 inline-block text-emerald-700 font-medium hover:underline"
          >
            Send Email
          </a>
        </>
      ),
    },
    {
      title: "Head Office",
      icon: "🏢",
      content: (
        <>
          <span className="block">123 Eco Street</span>
          <span className="block">Green City, Earth 10001</span>
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-emerald-700 font-medium hover:underline"
          >
            View on Map
          </a>
        </>
      ),
    },
    {
      title: "Working Hours",
      icon: "⏰",
      content: (
        <>
          <span className="block">Mon–Fri: 9am–6pm</span>
          <span className="block">Sat: 10am–4pm</span>
          <span className="block">Sun: Closed</span>
        </>
      ),
    },
  ].map((item, i) => (
    <div
      key={i}
      className="p-6 rounded-2xl bg-white/20 backdrop-blur-lg shadow-lg flex flex-col items-center text-center transform transition duration-300"
    >
      <div className="text-3xl mb-3">{item.icon}</div>
      <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
      <div className="text-gray-700 text-sm leading-relaxed">{item.content}</div>
    </div>
  ))}
</section>

    </Layout>
  );
};

export default Contact;
