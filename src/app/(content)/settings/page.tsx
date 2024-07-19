"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../lib/hooks/redux";
import useAuth from "../../../lib/hooks/useAuth";
import { toast } from "react-toastify";
import { EventTracker } from "../../../eventTracker";
import axios from "axios";
import { canUseNotifications } from "../../../lib/utils/notificationUtils";
import useNotification from "../../../lib/hooks/useNotification";
import { updateUserSettings } from "../../../lib/features/auth/authSlice";
import { ThemeToggle } from "../../../components/themeToggle";
import { cn } from "../../../lib/utils";

interface SettingsProps {}

const SettingsScreen: React.FC<SettingsProps> = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { deleteUser, signOut } = useAuth();
  const { initNotifications: initUserToken, requestNotificationsPermission } =
    useNotification();
  const [settings, setSettings] = useState(
    user?.settings ?? {
      showNotifications: false,
      soundEffects: true,
    },
  );

  const changeNotificationTimeout = useRef<NodeJS.Timeout | null>(null);

  const isNotificationsGranted =
    canUseNotifications() && Notification.permission === "granted";

  useEffect(() => {
    console.log(settings);
  }, [settings]);

  useEffect(() => {
    if (user) {
      setSettings(user?.settings);
    }
  }, [user]);

  const updateNotificationSettings = (showNotifications: boolean) => {
    if (changeNotificationTimeout.current) {
      clearTimeout(changeNotificationTimeout.current);
    }

    setSettings({ ...settings, showNotifications });

    changeNotificationTimeout.current = setTimeout(async () => {
      changeNotificationTimeout.current = null;
      try {
        await axios.patch("/api/user/settings", { showNotifications });
        if (showNotifications) {
          await initUserToken();
        }
        dispatch(updateUserSettings({ showNotifications }));
      } catch (e) {
        toast.error("Failed to update notification settings");
      }
    }, 1000);
  };

  const handleDeleteUserRequest = async () => {
    EventTracker.track("delete_user_request");
    const email = prompt(
      `Please enter your email (${user?.email}) to confirm deletion`,
    );
    if (email === user?.email) {
      toast.promise(deleteUser(), {
        pending: "Deleting user...",
        success: "User deleted",
        error: "Failed to delete user",
      });
    } else {
      if (email) {
        alert("Email is incorrect");
      }
    }
  };

  const handleSignOut = async () => {
    EventTracker.track("sign_out");
    toast.promise(signOut(), {
      pending: "Signing out...",
      success: "Signed out",
      error: "Failed to sign out",
    });
  };

  const Section = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={cn("p-3", className)}>{children}</div>;

  const SectionTitle = ({ value }: { value: string }) => (
    <div className="px-4 py-[18px]">
      <span className="text-base font-medium leading-5 tracking-[0.1px] text-primary dark:text-secondary-foreground">
        {value}
      </span>
    </div>
  );

  const SectionContent = ({ children }: { children: React.ReactNode }) => (
    <div className="px-4">{children}</div>
  );

  return (
    <div className="flex flex-col gap-7 mt-3">
      <div>
        <h1>Settings</h1>
      </div>
      {/* {canUseNotifications() && (
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold">Notifications</span>
          <div className="pl-2">
            {isNotificationsGranted ? (
              <Switch
                className="w-10"
                onCheckedChange={updateNotificationSettings}
                checked={settings.showNotifications}
              />
            ) : (
              <Button
                variant="default"
                className="w-fit px-2"
                onClick={() => {
                  requestNotificationsPermission().then(granted => {
                    if (granted) {
                      updateNotificationSettings(true);
                    }
                  });
                }}
              >
                Enable notifications
              </Button>
            )}
          </div>
        </div>
      )} */}
      <div className="flex flex-col gap-4">
        <Section className="flex flex-col gap-2">
          <SectionTitle value="Theme" />
          <SectionContent>
            <ThemeToggle />
          </SectionContent>
        </Section>
      </div>
    </div>
  );
};

export default SettingsScreen;
