import { useState } from "react"
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {   
    const [loading, setLoading] = useState(false);
    const {setAuthUser} = useAuthContext();

    const signup = async({fullName, username, password, confirmPassword, gender}) => {
        const success = handleInputErrors({fullName, username, password, confirmPassword, gender});

        if(!success) return;

        setLoading(true);
        try {
            // After doing change in vite.config.js for proxy for api/
            // We can remove http://localhost:8000 from following 
            // Previosly it was http://localhost:8000/api/auth/signup
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({fullName, username, password, confirmPassword, gender})
            });

            const data = await res.json();

            if(!data.success) {
                throw new Error(data.error);
            }

            // Set localstorage
            localStorage.setItem("chat-user", JSON.stringify(data));
            // Update context
            setAuthUser(data);
            
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    return {loading, signup};
}

export default useSignup

function handleInputErrors({fullName, username, password, confirmPassword, gender}) {
    if( !fullName || !username || !password || !confirmPassword || !gender) {
        toast.error("Please fill all the fields");
        return false;
    }

    if(password !== confirmPassword) {
        toast.error("Password do not match");
        return false;
    }

    if(password.length < 6) {
        toast.error("password must be atleast 6 characters");
        return false
    }

    return true;
}