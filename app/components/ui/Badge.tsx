export const Badge = ({ children, variant = "red" }: { children: React.ReactNode, variant?: "red" | "yellow" | "orange" }) => {
  const colors = {
    red: "bg-red-500 text-white",
    orange: "bg-orange-500 text-white",
    yellow: "bg-yellow-500 text-white",
  };
  return (
    <span className={`${colors[variant]} px-3 py-1 rounded-full text-xs font-bold shadow-sm`}>
      {children}
    </span>
  );
};