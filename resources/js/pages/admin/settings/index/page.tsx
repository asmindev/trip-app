import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { Head, useForm } from '@inertiajs/react';
import { Clock, CreditCard, Globe, Home, Save, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface Setting {
    id: number;
    key: string;
    label: string;
    value: any;
    type: string;
}

interface SettingsData {
    general?: Setting[];
    booking?: Setting[];
    payment?: Setting[];
    homepage?: Setting[];
}

interface SettingsIndexProps {
    settings: SettingsData;
}

export default function SettingsIndex({ settings }: SettingsIndexProps) {
    const { data, setData, put, processing } = useForm({
        settings: Object.values(settings)
            .flat()
            .map((s) => ({
                id: s.id,
                value: s.type === 'json' ? JSON.stringify(s.value, null, 2) : s.value,
            })),
    });

    const updateValue = (id: number, value: any) => {
        setData(
            'settings',
            data.settings.map((s) => (s.id === id ? { ...s, value } : s)),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.settings.update'), {
            onSuccess: () => toast.success('Pengaturan berhasil disimpan!'),
            onError: () => toast.error('Gagal menyimpan pengaturan'),
        });
    };

    const getSettingValue = (key: string) => {
        const setting = Object.values(settings)
            .flat()
            .find((s) => s.key === key);
        const formSetting = data.settings.find((s) => s.id === setting?.id);
        return formSetting?.value ?? setting?.value ?? '';
    };

    const getSettingId = (key: string) => {
        const setting = Object.values(settings)
            .flat()
            .find((s) => s.key === key);
        return setting?.id;
    };

    const renderField = (setting: Setting) => {
        const currentValue = data.settings.find((s) => s.id === setting.id)?.value ?? setting.value;

        if (setting.type === 'boolean') {
            return (
                <div className="flex items-center justify-between">
                    <Label htmlFor={setting.key}>{setting.label}</Label>
                    <Switch
                        id={setting.key}
                        checked={currentValue === '1' || currentValue === true}
                        onCheckedChange={(checked) => updateValue(setting.id, checked ? '1' : '0')}
                    />
                </div>
            );
        }

        if (setting.type === 'json') {
            return (
                <div className="space-y-2">
                    <Label htmlFor={setting.key}>{setting.label}</Label>
                    <Textarea
                        id={setting.key}
                        value={typeof currentValue === 'string' ? currentValue : JSON.stringify(currentValue, null, 2)}
                        onChange={(e) => updateValue(setting.id, e.target.value)}
                        rows={8}
                        className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">Format: JSON</p>
                </div>
            );
        }

        if (setting.type === 'number') {
            return (
                <div className="space-y-2">
                    <Label htmlFor={setting.key}>{setting.label}</Label>
                    <Input id={setting.key} type="number" value={currentValue} onChange={(e) => updateValue(setting.id, e.target.value)} />
                </div>
            );
        }

        return (
            <div className="space-y-2">
                <Label htmlFor={setting.key}>{setting.label}</Label>
                <Input id={setting.key} value={currentValue} onChange={(e) => updateValue(setting.id, e.target.value)} />
            </div>
        );
    };

    const groupIcons = {
        general: Settings,
        booking: Clock,
        payment: CreditCard,
        homepage: Home,
    };

    const groupLabels: Record<string, string> = {
        general: 'Umum',
        booking: 'Booking',
        payment: 'Pembayaran',
        homepage: 'Homepage',
    };

    return (
        <AdminLayout title="Pengaturan">
            <Head title="Pengaturan" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
                    <p className="text-muted-foreground">Kelola pengaturan aplikasi dan konten homepage</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Tabs defaultValue="general" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            {Object.keys(settings).map((group) => {
                                const Icon = groupIcons[group as keyof typeof groupIcons] || Globe;
                                return (
                                    <TabsTrigger key={group} value={group} className="flex items-center gap-2">
                                        <Icon className="size-4" />
                                        {groupLabels[group] || group}
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>

                        {Object.entries(settings).map(([group, groupSettings]) => (
                            <TabsContent key={group} value={group}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{groupLabels[group] || group}</CardTitle>
                                        <CardDescription>
                                            {group === 'homepage' ? 'Kelola konten yang ditampilkan di halaman utama' : 'Pengaturan dasar aplikasi'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {groupSettings.map((setting) => (
                                            <div key={setting.id}>{renderField(setting)}</div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>

                    <div className="mt-6 flex justify-end">
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 size-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
