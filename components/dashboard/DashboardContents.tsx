"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface OfficeInfo {
  name: string;
  office_type: string;
}

interface Staff {
  id: string;
  name: string;
  role: string;
  offices: OfficeInfo[];
}

export function DashboardContents() {
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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!staff) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Failed to fetch staff information.</p>
        </CardContent>
      </Card>
    );
  }

  const hasOffice = staff.offices && staff.offices.length > 0;

  if (!hasOffice) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-yellow-600">事務所未登録</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            ダッシュボードを使用するには、最初に事務所を登録する必要があります。
          </p>
          <Link
            href="/auth/admin/office_setup"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            事務所登録
          </Link>
        </CardContent>
      </Card>
    );
  }

  const office = staff.offices[0];
  const officeTypeMap: Record<string, string> = {
    transition_to_employment: "就労移行支援",
    "type_A_office": "就労継続支援A型",
    "type_B_office": "就労継続支援B型",
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-lg mb-2">Staff Information</h3>
              <p className="text-sm test-white">Name: {staff.name}</p>
              <p className="text-sm test-white">
                Role: {staff.role === "service_administrator" ? "Service Administrator" : staff.role}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Office Information</h3>
              <p className="text-sm test-white">Office Name: {office.name}</p>
              <p className="text-sm test-white">
                Type: {officeTypeMap[office.office_type] || office.office_type}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm test-white mb-4">
              Manage user information
            </p>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">
              User List
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Support Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm test-white mb-4">
              Create and manage individual support plans
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
              Plan List
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm test-white mb-4">
              View various reports
            </p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full">
              Report List
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}