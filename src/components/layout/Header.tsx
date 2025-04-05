import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '../ui/button';
import { useWeb3 } from '../../context/Web3Context';
import { Leaf, Menu, X } from 'lucide-react'; // Import icons for the logo and mobile menu

const Header: React.FC = () => {
  const { account, connect, disconnect } = useWeb3();
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Add state for mobile menu

  const handleConnect = async () => {
    setError(null);
    try {
      await connect();
    } catch (err) {
      const message = (err as Error).message;
      if (message.includes("MetaMask provider not detected")) {
        setError(
          <>
            MetaMask not detected. Please{' '}
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-300"
            >
              install MetaMask
            </a>{' '}
            and try again.
          </>
        );
      } else {
        setError(message || 'Failed to connect wallet');
      }
    }
  };

  // Define navigation items
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/tokenization", label: "Tokenization" },
    { path: "/wallet", label: "Wallet" },
    { path: "/marketplace", label: "Marketplace" },
    { path: "/sustainability", label: "Sustainability" },
    { path: "/dashboard", label: "Dashboard" },
  ];

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo with Leaf Icon */}
        <NavLink to="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="font-bold text-xl text-green-800">
            Carbon Forest
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link relative py-1 text-gray-700 hover:text-green-600 font-medium ${
                  isActive ? 'active' : ''
                }`
              }
            >
              {item.label}
              <span className="nav-indicator"></span>
            </NavLink>
          ))}
          {account ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                {`${account.slice(0, 6)}...${account.slice(-4)}`}
              </span>
              <Button
                onClick={disconnect}
                className="bg-red-600 hover:bg-red-700"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleConnect}
                className="bg-green-600 hover:bg-green-700"
              >
                Connect Wallet
              </Button>
              {error && (
                <span className="text-red-300 text-sm">{error}</span>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 px-4">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link relative py-1 text-gray-700 hover:text-green-600 font-medium ${
                  isActive ? 'active' : ''
                }`
              }
            >
              {item.label}
              <span className="nav-indicator"></span>
            </NavLink>
            ))}
            {account ? (
              <div className="flex flex-col space-y-4">
                <span className="text-sm text-gray-700">
                  {`${account.slice(0, 6)}...${account.slice(-4)}`}
                </span>
                <Button
                  onClick={() => {
                    disconnect();
                    setIsMenuOpen(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 w-full"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <Button
                  onClick={() => {
                    handleConnect();
                    setIsMenuOpen(false);
                  }}
                  className="bg-green-600 hover:bg-green-700 w-full"
                >
                  Connect Wallet
                </Button>
                {error && (
                  <span className="text-red-300 text-sm">{error}</span>
                )}
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Include the navigation animation styles */}
      <style>{`
        .nav-link {
          transition: color 0.3s ease;
        }

        .nav-link .nav-indicator {
          position: absolute;
          bottom: -2px;
          left: 0;
          height: 2px;
          width: 0;
          background-color: #16a34a; /* green-600 */
          transition: width 0.3s ease;
        }

        .nav-link:hover .nav-indicator {
          width: 100%;
        }

        .nav-link.active .nav-indicator {
          width: 100%;
          background-color: #16a34a; /* green-600 */
        }

        .mobile-active {
          color: #16a34a; /* green-600 */
          font-weight: 600;
        }
      `}</style>
    </header>
  );
};

export default Header;