import { Link } from "react-router-dom";
import logo from '../assets/logo.png';

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Manage Tickets", path: "/manage" },
    { name: "Routes", path: "/routes" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 bg-white shadow-md px-6 py-4 ">
     <div className="container flex justify-between items-center">
         <div className="w-40 h-10">
        <img src={logo} alt="Logo" />
      </div>
      <ul className="flex gap-10 text-lg text-[#0B1B35] leading-[35px]">
        {navLinks.map(({ name, path }) => (
          <li key={name}>
            <Link to={path} className="">
              {name}
            </Link>
          </li>
        ))}
      </ul>
     </div>
    </nav>
  );
};

export default Navbar;
