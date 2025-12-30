import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CalendarIcon, Save } from 'lucide-react';

interface Props {
    branches: { id: number; name: string }[];
    categories: { id: number; name: string }[];
}

export default function ExpenseCreate({ branches, categories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        branch_id: '',
        expense_category_id: '',
        amount: '',
        expense_date: new Date().toISOString().split('T')[0],
        description: '',
        proof_file: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.expenses.store'));
    };

    return (
        <AdminLayout title="Tambah Pengeluaran">
            <Head title="Tambah Pengeluaran" />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 p-4 md:p-8">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={route('admin.expenses.index')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">Input Pengeluaran Baru</h2>
                        <p className="text-muted-foreground">Isi detail pengeluaran dengan lengkap.</p>
                    </div>
                </div>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Formulir Pengeluaran</CardTitle>
                        <CardDescription>Pastikan bukti bayar diupload untuk validasi.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Branch Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="branch_id">Cabang</Label>
                                    <Select value={data.branch_id} onValueChange={(val) => setData('branch_id', val)}>
                                        <SelectTrigger id="branch_id" className={errors.branch_id ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Pilih Cabang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {branches.map((branch) => (
                                                <SelectItem key={branch.id} value={branch.id.toString()}>
                                                    {branch.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.branch_id && <p className="text-sm text-destructive">{errors.branch_id}</p>}
                                </div>

                                {/* Date Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="expense_date">Tanggal Pengeluaran</Label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="expense_date"
                                            type="date"
                                            className={`pl-9 ${errors.expense_date ? 'border-destructive' : ''}`}
                                            value={data.expense_date}
                                            onChange={(e) => setData('expense_date', e.target.value)}
                                        />
                                    </div>
                                    {errors.expense_date && <p className="text-sm text-destructive">{errors.expense_date}</p>}
                                </div>

                                {/* Category Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="expense_category_id">Kategori Pengeluaran</Label>
                                    <Select value={data.expense_category_id} onValueChange={(val) => setData('expense_category_id', val)}>
                                        <SelectTrigger id="expense_category_id" className={errors.expense_category_id ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Pilih Kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.expense_category_id && <p className="text-sm text-destructive">{errors.expense_category_id}</p>}
                                </div>

                                {/* Amount Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Nominal (Rp)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="0"
                                        className={errors.amount ? 'border-destructive' : ''}
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        min="0"
                                    />
                                    {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Keterangan / Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Jelaskan detail pengeluaran..."
                                    className={`min-h-[100px] ${errors.description ? 'border-destructive' : ''}`}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>

                            {/* File Upload */}
                            <div className="space-y-2">
                                <Label htmlFor="proof_file">Bukti / Nota (Opsional)</Label>
                                <Input
                                    id="proof_file"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('proof_file', e.target.files ? e.target.files[0] : null)}
                                />
                                <p className="text-xs text-muted-foreground">Format: JPG, PNG. Maks 2MB.</p>
                                {errors.proof_file && <p className="text-sm text-destructive">{errors.proof_file}</p>}
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                    {processing ? (
                                        'Menyimpan...'
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Simpan Pengeluaran
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
