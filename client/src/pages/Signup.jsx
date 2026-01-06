import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    role: "Performer",
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(registerUser(form));
    if (res.type === "auth/register/fulfilled") {
      navigate("/dashboard");
    }
  };

  return (
    <div className=" bg-slate-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="hidden lg:block">
                <div className="relative h-72 rounded-lg overflow-hidden shadow-md">
                  <img
                    src="/src/assets/hero.jpg"
                    alt="Hero"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <h3 className="mt-4 text-lg font-medium">Join PathCrafters</h3>
                <p className="text-sm text-gray-500">
                  Create paths, collaborate with your team and manage
                  performances.
                </p>
              </div>

              <div>
                <form
                  onSubmit={onSubmit}
                  className="grid grid-cols-1 gap-2 mr-4 mb-7"
                >
                  <h6 className="mt-4 text-left">Enter Your Username</h6>
                  <Input
                    id="username"
                    name="username"
                    label="Username"
                    value={form.username}
                    onChange={onChange}
                    placeholder="Your username"
                  />
                  <h6 className=" mt-0 text-left">Enter Your Email</h6>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="you@gmail.com"
                  />
                  <h6 className="mt-0 text-left">Enter Your Password</h6>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    value={form.password}
                    onChange={onChange}
                    placeholder="Use at least 8 characters(mix of letters, numbers etc.)"
                  />

                  <h6 className="mb - 0 text-left">Phone No.</h6>
                  <Input
                    id="phone"
                    name="phone"
                    label="Phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="Your phone number"
                  />
                  <h6 className="text-left">Address</h6>
                  <Input
                    id="location"
                    name="location"
                    label="Location"
                    value={form.location}
                    onChange={onChange}
                    placeholder="Your address"
                  />

                  <div>
                    <label className="block text-left font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={onChange}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      <option>Performer</option>
                      <option>Head</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={status === "loading"}
                    >
                      {status === "loading"
                        ? "Creating account…"
                        : "Create account"}
                    </Button>
                  </div>

                  {error && (
                    <div className="text-red-600">
                      {error.message || JSON.stringify(error)}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Signup;
