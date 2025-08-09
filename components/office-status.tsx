"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface OfficeInfo {
  name: string;
  office_type: string;
}

interface Staff {
  role: string;
  offices: OfficeInfo[];
}

export function OfficeStatus() {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffInfo = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setLoading(false);
          return;
        }

        const response = await fetch("/api/v1/staffs/me", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const staffData = await response.json();
          setStaff(staffData);
        }
      } catch (error) {
        console.error("Failed to fetch staff info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffInfo();
  }, []);

  if (loading) {
    return <div className="text-sm">読み込み中...</div>;
  }

  if (!staff || staff.role !== "service_administrator") {
    return null;
  }

  const hasOffice = staff.offices && staff.offices.length > 0;

  if (!hasOffice) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-yellow-600 text-sm">⚠️ 事業所の登録が完了していません</span>
        <Link
          href="/auth/admin/office_setup"
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          事業所作成
        </Link>
      </div>
    );
  }

  return (
    <div className="text-sm test-white">
      事業所: {staff.offices[0].name}
    </div>
  );
}