import { AdminLayout } from '@/layouts/admin-layout';

export default function MonitorPage() {
    return (
        <AdminLayout title="Pulse">
            <iframe src={'/pulse'} className="h-[calc(100vh-64px)] w-full" />
        </AdminLayout>
    );
}
