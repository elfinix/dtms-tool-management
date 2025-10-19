interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`border-t border-white/20 bg-white/90 backdrop-blur-md py-8 mt-auto relative z-10 ${className}`}>
      <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-24 text-center">
        <p className="text-muted-foreground">&copy; 2025 DPR Aviation College. All rights reserved.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Contact: toolmanagement@dpraviation.edu | +1 (555) 123-4567
        </p>
      </div>
    </footer>
  );
}
