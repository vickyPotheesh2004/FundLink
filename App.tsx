import React, { useState } from "react";
import { LoginSelection } from "./components/LoginSelection";
import { StartupDashboard } from "./components/StartupDashboard";
import { InvestorDashboard } from "./components/InvestorDashboard";

export type UserRole = "startup" | "investor" | null;

export interface StartupProject {
  id: string;
  name: string;
  idea: string;
  implementation: string;
  targetAudience: string;
  problemSolution: string;
  category: string;
  userId: string;
}

export interface Investor {
  id: string;
  name: string;
  company: string;
  focusAreas: string[];
  fundingStage: string[];
  description: string;
  location: string;
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  fromUserCompany: string;
  fromUserRole: "startup" | "investor";
  status: "pending" | "accepted" | "rejected";
  message?: string;
  createdAt: string;
  projectName?: string; // For startup requests
}

export interface Notification {
  id: string;
  userId: string;
  type:
    | "connection_request"
    | "request_accepted"
    | "request_rejected";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedRequestId?: string;
}

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [connectionRequests, setConnectionRequests] = useState<
    ConnectionRequest[]
  >([]);
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const handleLogin = (role: UserRole, userData: any) => {
    setUserRole(role);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setConnectionRequests([]);
    setNotifications([]);
  };

  const sendConnectionRequest = (
    toUserId: string,
    toUserName: string,
    toUserCompany: string,
    toUserRole: "startup" | "investor",
    message?: string,
    projectName?: string,
  ) => {
    const requestId = Math.random().toString(36).substring(2, 9);

    const newRequest: ConnectionRequest = {
      id: requestId,
      fromUserId: currentUser.id,
      toUserId,
      fromUserName: currentUser.name,
      fromUserCompany: currentUser.company,
      fromUserRole: userRole as "startup" | "investor",
      status: "pending",
      message,
      createdAt: new Date().toISOString(),
      projectName,
    };

    const notification: Notification = {
      id: Math.random().toString(36).substring(2, 9),
      userId: toUserId,
      type: "connection_request",
      title: "New Connection Request",
      message: `${currentUser.name} from ${currentUser.company} wants to connect with you`,
      isRead: false,
      createdAt: new Date().toISOString(),
      relatedRequestId: requestId,
    };

    setConnectionRequests((prev) => [...prev, newRequest]);
    setNotifications((prev) => [...prev, notification]);
  };

  const respondToConnectionRequest = (
    requestId: string,
    response: "accepted" | "rejected",
  ) => {
    setConnectionRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? { ...req, status: response }
          : req,
      ),
    );

    // Find the request to get sender info
    const request = connectionRequests.find(
      (req) => req.id === requestId,
    );
    if (request) {
      const responseNotification: Notification = {
        id: Math.random().toString(36).substring(2, 9),
        userId: request.fromUserId,
        type:
          response === "accepted"
            ? "request_accepted"
            : "request_rejected",
        title:
          response === "accepted"
            ? "Connection Request Accepted!"
            : "Connection Request Declined",
        message: `${currentUser.name} has ${response} your connection request`,
        isRead: false,
        createdAt: new Date().toISOString(),
        relatedRequestId: requestId,
      };

      setNotifications((prev) => [
        ...prev,
        responseNotification,
      ]);
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId
          ? { ...notif, isRead: true }
          : notif,
      ),
    );
  };

  const markAllNotificationsAsRead = (userId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.userId === userId
          ? { ...notif, isRead: true }
          : notif,
      ),
    );
  };

  // Get notifications for current user
  const userNotifications = notifications.filter(
    (notif) => notif.userId === currentUser?.id,
  );
  const unreadCount = userNotifications.filter(
    (notif) => !notif.isRead,
  ).length;

  // Get connection requests for current user
  const incomingRequests = connectionRequests.filter(
    (req) =>
      req.toUserId === currentUser?.id &&
      req.status === "pending",
  );
  const outgoingRequests = connectionRequests.filter(
    (req) => req.fromUserId === currentUser?.id,
  );

  if (!userRole) {
    return <LoginSelection onLogin={handleLogin} />;
  }

  const sharedProps = {
    currentUser,
    onLogout: handleLogout,
    sendConnectionRequest,
    respondToConnectionRequest,
    connectionRequests,
    notifications: userNotifications,
    unreadNotificationsCount: unreadCount,
    incomingRequests,
    outgoingRequests,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };

  return (
    <div className="min-h-screen bg-background">
      {userRole === "startup" ? (
        <StartupDashboard {...sharedProps} />
      ) : (
        <InvestorDashboard {...sharedProps} />
      )}
    </div>
  );
}