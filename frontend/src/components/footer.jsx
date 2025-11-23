export default function Footer() {
    const appName= import.meta.env.VITE_APP_NAME
  return (
    <footer className=" bg-white text-black p-2 text-center">
      © 2025 .  {appName} All rights reserved.
    </footer>
  );
}
