import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 flex gap-5 items-center z-[60] w-max">
      <div className="backdrop-blur-sm border p-2 rounded-full shadow-lg">
        <img src="/logo.svg" alt="HydroTrust AI Logo" className="h-8 mr-1" />
      </div>
      <nav className="py-2 backdrop-blur-sm border rounded-full shadow-lg md:flex hidden items-center gap-6 pl-6 pr-2">
        {[
          { label: "Home", target: "home" },
          { label: "Problem", target: "problem" },
          { label: "Solution", target: "solution" },
          { label: "How It Works", target: "how" },
        ].map(({ label, target }) => (
          <button
            key={label}
            className="text-white h-8 whitespace-nowrap"
            onClick={() => {
              const el = document.getElementById(target);
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            {label}
          </button>
        ))}
        <Button
          className="h-8 rounded-full whitespace-nowrap px-3"
          variant="secondary"
          onClick={() => {
            const el = document.getElementById("join-waitlist");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          Join Now
        </Button>
      </nav>
    </header>
  );
};
