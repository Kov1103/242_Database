import AdminSidebar from "../ui/admin/sidebar";
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


export default function ManagerBooking() {

    return (
        <div className="flex-1 min-h-0 max-h-[calc(100vh-76px)] bg-[#fafafa] w-full flex flex-row gap-5 items-start overflow-hidden">
            <AdminSidebar />
            <div className="flex flex-col items-start gap-3 w-full py-7 px-5 text-[#1b1b1b] overflow-hidden">
                <p className="text-2xl font-extrabold">Hóa đơn</p>
                <div className="my-2 flex flex-col items-start gap-2 w-full h-[calc(100vh-240px)] overflow-y-auto scrollbar-hide">
                    {fileredUsers?.map((user, index) => (
                        <UserItem key={index} user={user} />
                    ))}
                </div>
            </div>
        </div>
    );
}