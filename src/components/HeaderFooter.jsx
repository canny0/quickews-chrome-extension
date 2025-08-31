import Footer from "./Footer";
import Header from "./Header";
import classes from "./HeaderFooter.module.css";

export default function HeaderFooter({ children }) {
  return (
    <div className={classes.root}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
