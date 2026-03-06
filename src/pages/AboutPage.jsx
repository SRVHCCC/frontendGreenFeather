import React from "react";
import Layout from "../components/layout/Layout";
import { Leaf, BookOpen, Users, Globe } from "lucide-react";
import CountUp from "react-countup";

const About = () => {
  const PRIMARY_COLOR = "text-emerald-700";
  const ACCENT_BG = "bg-emerald-600";
  const ACCENT_HOVER = "hover:bg-emerald-700";

  const values = [
    {
      icon: <Globe className={`w-8 h-8 ${PRIMARY_COLOR}`} />,
      title: "Environmental Responsibility",
      desc: "Sustainable sourcing, eco-friendly packaging, and green initiatives at every step.",
    },
    {
      icon: <BookOpen className={`w-8 h-8 ${PRIMARY_COLOR}`} />,
      title: "Quality Literature",
      desc: "Curated books that educate, inspire, and entertain readers of all ages.",
    },
    {
      icon: <Users className={`w-8 h-8 ${PRIMARY_COLOR}`} />,
      title: "Community Support",
      desc: "Supporting local authors, independent publishers, and literacy programs.",
    },
  ];

  const stats = [
    { value: 10000, label: "Books Sold" },
    { value: 500, label: "Trees Planted" },
    { value: 1000, label: "Happy Customers" },
    { value: 50, valuePrefix: "+", label: "Partner Authors" },
  ];

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80"
          alt="Books & Eco"
          className="w-full h-[550px] object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-xl tracking-tight">
            Our Story: The <span className="text-emerald-400">GreenFeather</span> Way
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-light text-gray-100 max-w-3xl drop-shadow-md">
            Sustainable books for a greener planet—where great reading meets eco-conscious living.
          </p>
          <button
            className="mt-8 bg-gradient-to-r from-green-500 to-yellow-400 text-white px-10 py-4 rounded-full font-bold text-lg 
            shadow-xl shadow-emerald-500/30 hover:from-green-600 hover:to-yellow-500 
            transition-transform duration-300 hover:scale-[1.02]"
          >
            Explore Our Eco-Books
          </button>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-20 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6 lg:order-2">
          <h2 className={`text-4xl md:text-5xl font-extrabold text-gray-800 border-l-4 pl-4 border-emerald-500`}>
            Our Core <span className={PRIMARY_COLOR}>Mission</span>
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            At GreenFeather, we believe in making knowledge accessible while protecting our planet. We source all our books from eco-friendly publishers and use 100% recyclable, sustainable packaging.
          </p>
          <p className="text-lg text-gray-600">
            More than just an online store, we are a commitment. Every book purchased helps fund our tree planting initiatives to offset our collective carbon footprint, fostering a greener future with every page turned.
          </p>
        </div>
        <div className="relative lg:order-1">
          <img
            src="/imgs/about_img/mission.png"
            alt="Mission Image"
            className="rounded-3xl shadow-2xl shadow-emerald-200/50 w-full h-auto"
          />
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">
              The <span className={PRIMARY_COLOR}>Values</span> We Stand By
            </h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-lg">
              Our commitment to the planet, our readers, and our community drives every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((val, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 text-center 
                hover:shadow-emerald-400/40 hover:shadow-2xl hover:-translate-y-1 transition duration-300"
              >
                <div className="w-16 h-16 mx-auto bg-emerald-100/70 rounded-full flex items-center justify-center mb-6">
                  {val.icon}
                </div>
                <h3 className={`text-xl font-bold ${PRIMARY_COLOR} mb-3`}>{val.title}</h3>
                <p className="text-gray-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`${ACCENT_BG} text-white py-16`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Making a Real <span className="text-emerald-200">Difference</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="p-4 border-r border-emerald-500 last:border-r-0">
                <div className="text-5xl font-extrabold mb-1">
                  {stat.valuePrefix && <span>{stat.valuePrefix}</span>}
                  <CountUp end={stat.value} duration={2.5} separator="," />
                </div>
                <div className="text-emerald-200 text-lg font-medium tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
  