const Footer = () => {
  return (
    <footer
      className="
        w-full
        border-t border-(--border)
        py-2 px-4
        text-center text-sm
        text-(--text-secondary)
      "
    >
      © Habitos 2026 •{" "}
      <a
        href="https://github.com/prajwallakra/habitos"
        target="_blank"
        rel="noopener noreferrer"
        className="
          text-violet-500
          hover:text-violet-400
          font-medium transition-colors
        "
      >
        GitHub Repo
      </a>
    </footer>
  );
};

export default Footer;