import {
  FaRegArrowAltCircleRight,
  FaFacebookF,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from 'react-icons/fa';

function Footer() {
  const companyLinks = [
    { label: 'About Us', icon: FaRegArrowAltCircleRight, Link: 'about' },
    { label: 'Contact Us', icon: FaRegArrowAltCircleRight, Link: 'contact' },
    { label: 'Reservation', icon: FaRegArrowAltCircleRight, Link: 'contact' },
    { label: 'Privacy Policy', icon: FaRegArrowAltCircleRight, Link: '' },
    { label: 'Terms & Condition', icon: FaRegArrowAltCircleRight, Link: '' },
  ];

  const contactInfo = [
    { icon: FaMapMarkerAlt, text: 'Thạch hòa - Thạch Thất - Hà Nội' },
    { icon: FaPhoneAlt, text: '+012 345 67890' },
    { icon: FaEnvelope, text: 'info@example.com' },
  ];

  const socialLinks = [
    { icon: FaTwitter, href: '#' },
    { icon: FaFacebookF, href: '#' },
    { icon: FaYoutube, href: '#' },
    { icon: FaLinkedin, href: '#' },
  ];

  const bottomLinks = [
    { label: 'Home', href: '#' },
    { label: 'Cookies', href: '#' },
    { label: 'Help', href: '#' },
    { label: 'FAQs', href: '#' },
  ];

  return (
    <div className="mt-20 bg-[#F97316]">
      <div className="px-12 py-12 mx-auto ">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Company */}
          <div>
            <h3 className="mb-6 text-xl font-semibold text-yellow-400">Company</h3>
            <ul className="">
              {companyLinks.map((link, index) => (
                <li key={index} className="flex items-center space-x-3 space-y-1 text-sm transition-colors hover:text-yellow-400">
                  <link.icon className="text-yellow-400" />
                  <a href={link.Link} className="hover:underline">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-xl font-semibold text-yellow-400">Contact</h3>
            <ul className="space-y-3 text-sm">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <info.icon className="text-yellow-400" />
                  <span>{info.text}</span>
                </li>
              ))}
            </ul>
            <div className="flex mt-5 space-x-3">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-white text-white hover:bg-yellow-400 hover:text-[#181c2c] transition-colors"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Opening */}
          <div>
            <h3 className="mb-6 text-xl font-semibold text-yellow-400">Opening</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex flex-col">
                <span>Monday - Saturday</span>
                <span className="text-gray-300">09AM - 09PM</span>
              </li>
              <li className="flex flex-col">
                <span>Sunday</span>
                <span className="text-gray-300">10AM - 08PM</span>
              </li>
            </ul>
          </div>


        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between pt-6 mt-10 text-sm border-t border-gray-700 md:flex-row">
          <div className="mb-2 md:mb-0">
            &copy; <a href="https://yoursitename.com" className="text-yellow-400 underline">Your Site Name</a>, All Right Reserved.
          </div>
          <div className="flex space-x-6">
            {bottomLinks.map((link, idx) => (
              <a key={idx} href={link.href} className="transition-colors hover:text-yellow-400">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
