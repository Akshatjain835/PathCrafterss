import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getProfile , updateProfile} from "../features/auth/authSlice";

export const Profile = () => {

    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const [user, setUser] = useState({
      username:"",
      location:"",
      phone:"",
    });

    useEffect(() => {
      dispatch(getProfile()).then((data) => {
        if (data.payload?.success) {
          setUser({
            username: data.payload.user.username,
            location: data.payload.user.location,
            phone: data.payload.user.phone,
          });
        }
        setLoading(false);
      });
    }, [dispatch]);

    //console.log("user: ", user);
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [editData, setEditData] = useState(user);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setEditData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSaveChanges = () => {
        dispatch(updateProfile(editData)).then((data) => {
            if (data.payload?.success) {
                setIsDialogOpen(false);
                dispatch(getProfile()).then((data) => {
                  if (data.payload?.success) {
                    setUser({
                      username: data.payload.user.username,
                      location: data.payload.user.location,
                      phone: data.payload.user.phone,
                    });
                  }
                  setLoading(false);
                });
            }
        })
    };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-lg text-gray-500">Loading profile...</h1>
      </div>
    );
  }

  return (
    <div className="bg-white text-zinc-900 min-h-screen flex items-start justify-center p-6 sm:p-10 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-16">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <Avatar className="w-36 h-36 border-2 border-zinc-700">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-zinc-700 text-white text-xl">
                {user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Details */}
          <div className="flex flex-col items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-light text-zinc-900">
                {user.username}
              </h1>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setEditData(user)}
                    variant="secondary"
                    className="bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-semibold py-1 px-4 rounded-md"
                  >
                    Edit Profile
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px] bg-white border-zinc-100 text-zinc-900">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're
                      done.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="username"
                        className="text-right text-zinc-900"
                      >
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={editData.username}
                        onChange={handleInputChange}
                        className="col-span-3 bg-zinc-700 border-zinc-600 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="location"
                        className="text-right text-zinc-900"
                      >
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={editData.location}
                        onChange={handleInputChange}
                        className="col-span-3 bg-zinc-700 border-zinc-600 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="phone"
                        className="text-right text-zinc-900"
                      >
                        Mobile
                      </Label>
                      <Input
                        id="phone"
                        value={editData.phone}
                        onChange={handleInputChange}
                        className="col-span-3 bg-zinc-700 border-zinc-600 text-white"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleSaveChanges}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex flex-col gap-1 items-center sm:items-start">
              <p className="text-md text-zinc-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zinc-900" />
                {user.location}
              </p>
              <p className="text-md text-zinc-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-zinc-900" />
                {user.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
