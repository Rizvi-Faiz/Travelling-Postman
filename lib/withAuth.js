import jwt from "jsonwebtoken";
import { parseCookies } from "./cookies"; 

export default function withAuth(WrappedComponent) {
  const AuthenticatedComponent = (props) => {
    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.getServerSideProps = async (context) => {
    const { req } = context;
    const cookies = parseCookies(req);

    const token = cookies.token; 

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 
      return {
        props: {
          userId: decoded.userId, 
        },
      };
    } catch (error) {
      console.error("Token verification failed:", error);
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  };

  return AuthenticatedComponent;
}
