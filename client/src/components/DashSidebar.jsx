import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { Sidebar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { signOutDone, signOutFailure, signOutStart } from "../redux/user/userSlice";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch()
  const [tab, setTab] = useState();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    if(tabFromURL){
        setTab(tabFromURL);
      }
  }, [location.search]);

  const navigate = useNavigate()
    const handleSignOut = async()=>{
      dispatch(signOutStart())
      try {
        const res = await fetch(`/api/user/signout`, {
          method: "POST",
        })
        if(res.ok){
          dispatch(signOutDone())
          navigate("/")
        }
      } catch (error) {
        dispatch(signOutFailure(error.message))
      }
    
    }
  return (
    <Sidebar className="w-full md:w-56"> 
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={ tab === "profile" ? true : false}
              icon={HiUser}
              label={"user"}
              labelColor="dark"
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignOut}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
