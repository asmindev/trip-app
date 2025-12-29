import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { Head, useForm } from '@inertiajs/react';
import { Image as ImageIcon, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

interface Setting {
    id: number;
    key: string;
    label: string;
    value: string | File | null;
    type: 'text' | 'textarea' | 'image' | 'number' | 'json';
    group: string;
}

interface Props {
    groupedSettings: Record<string, Setting[]>;
}

export default function AdminSettingsPage({ groupedSettings }: Props) {
    const categories = Object.keys(groupedSettings);

    // Initialize form data
    const initialSettings: Record<string, string | File | null> = {};
    Object.values(groupedSettings)
        .flat()
        .forEach((s) => {
            initialSettings[s.key] = s.value;
        });

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        settings: initialSettings,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.settings.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Pengaturan berhasil disimpan');
            },
            onError: (err) => {
                console.error(err);
                toast.error('Gagal menyimpan pengaturan. Silakan periksa kembali inputan Anda.');
            },
        });
    };

    const handleFileChange = (key: string, file: File | null) => {
        setData('settings', {
            ...data.settings,
            [key]: file,
        });
    };

    return (
        <AdminLayout title="Pengaturan CMS">
            <Head title="Pengaturan CMS - Admin" />

            <div className="container mx-auto max-w-5xl py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Pengaturan CMS</h2>
                            <p className="text-muted-foreground">Kelola konten dan konfigurasi aplikasi secara dinamis.</p>
                        </div>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="px-8 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan Perubahan
                                </>
                            )}
                        </Button>
                    </div>

                    <Tabs defaultValue={categories[0]} className="w-full">
                        <TabsList className="mb-6 h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
                            {categories.map((category) => (
                                <TabsTrigger
                                    key={category}
                                    value={category}
                                    className="rounded-full border border-slate-200 bg-white px-6 py-2 capitalize data-[state=active]:bg-primary data-[state=active]:text-white dark:border-slate-800 dark:bg-slate-900"
                                >
                                    {category}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {categories.map((category) => (
                            <TabsContent key={category} value={category} className="space-y-6 outline-none">
                                <Card className="border-slate-200 shadow-sm transition-all hover:shadow-md dark:border-slate-800">
                                    <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50">
                                        <CardTitle className="text-xl font-bold capitalize">{category} Settings</CardTitle>
                                        <CardDescription>Atur konfigurasi untuk kelompok {category}.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-8 p-6">
                                        {groupedSettings[category].map((setting) => (
                                            <div key={setting.key} className="grid gap-3">
                                                <Label
                                                    htmlFor={setting.key}
                                                    className="text-sm font-semibold tracking-wider text-slate-500 uppercase"
                                                >
                                                    {setting.label}
                                                </Label>

                                                {setting.type === 'text' && (
                                                    <Input
                                                        id={setting.key}
                                                        className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                                                        value={data.settings[setting.key] || ''}
                                                        onChange={(e) => setData('settings', { ...data.settings, [setting.key]: e.target.value })}
                                                        placeholder={`Masukkan ${setting.label}...`}
                                                    />
                                                )}

                                                {setting.type === 'textarea' && (
                                                    <Textarea
                                                        id={setting.key}
                                                        className="min-h-[120px] transition-all focus:ring-2 focus:ring-primary/20"
                                                        value={data.settings[setting.key] || ''}
                                                        onChange={(e) => setData('settings', { ...data.settings, [setting.key]: e.target.value })}
                                                        placeholder={`Masukkan ${setting.label}...`}
                                                    />
                                                )}

                                                {setting.type === 'image' && (
                                                    <div className="grid gap-4">
                                                        <div className="flex items-center gap-6">
                                                            {setting.value && typeof setting.value === 'string' && (
                                                                <div className="group relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-100 p-2 shadow-inner dark:bg-slate-800">
                                                                    <img
                                                                        src={setting.value}
                                                                        alt={setting.label}
                                                                        className="max-h-full max-w-full object-contain transition-transform group-hover:scale-110"
                                                                    />
                                                                </div>
                                                            )}
                                                            {!setting.value && (
                                                                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-muted-foreground">
                                                                    <ImageIcon className="mb-2 h-8 w-8 opacity-30" />
                                                                    <span className="text-[10px] font-medium">No Image</span>
                                                                </div>
                                                            )}
                                                            <div className="flex-1 space-y-3">
                                                                <div className="text-sm text-slate-500">
                                                                    <p className="font-medium">Ubah Gambar</p>
                                                                    <p className="text-xs">Format: JPG, PNG, WEBP (Maks. 2MB)</p>
                                                                </div>
                                                                <Input
                                                                    id={setting.key}
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-1 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20"
                                                                    onChange={(e) =>
                                                                        handleFileChange(setting.key, e.target.files ? e.target.files[0] : null)
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {errors[`settings.${setting.key}`] && (
                                                    <p className="mt-1 text-xs font-medium text-destructive">{errors[`settings.${setting.key}`]}</p>
                                                )}
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>
                </form>
            </div>
        </AdminLayout>
    );
}
