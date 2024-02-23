import {
  HiAnnotation,
  HiArrowSmRight,
  HiChartPie,
  HiDocumentText,
  HiUser,
} from "react-icons/hi";
import { Sidebar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signOutDone,
  signOutFailure,
  signOutStart,
} from "../redux/user/userSlice";

export default function DashSidebar() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);

  const navigate = useNavigate();
  const handleSignOut = async () => {
    dispatch(signOutStart());
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
      });
      if (res.ok) {
        dispatch(signOutDone());
        navigate("/");
      }
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser.isAdmin && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={HiChartPie}
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile" ? true : false}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=posts">
            <Sidebar.Item
              active={tab === "posts" ? true : false}
              icon={HiDocumentText}
              labelColor="dark"
              as="div"
            >
              Posts
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=users">
            <Sidebar.Item
              active={tab === "users" ? true : false}
              icon={HiUser}
              labelColor="dark"
              as="div"
            >
              Users
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=comments">
            <Sidebar.Item
              active={tab === "comments" ? true : false}
              icon={HiAnnotation}
              labelColor="dark"
              as="div"
            >
              Comments
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
