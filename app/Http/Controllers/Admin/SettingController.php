<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingController extends Controller
{
    /**
     * Tampilkan halaman pengaturan yang dikelompokkan.
     */
    public function index()
    {
        $settings = Setting::orderBy('group')->get()
            ->map(function ($setting) {
                if ($setting->type === 'image' && $setting->value) {
                    $setting->value = Storage::url($setting->value);
                }
                return $setting;
            })
            ->groupBy('group');

        return Inertia::render('admin/settings/index/page', [
            'groupedSettings' => $settings,
        ]);
    }

    /**
     * Update pengaturan secara massal.
     */
    public function update(Request $request)
    {
        // Request format: { settings: { key: value, ... } }
        // Request format: { settings: { key: value, ... } }
        // Use all() to ensure files are included (request->input() excludes files)
        $data = $request->all();
        $inputs = $data['settings'] ?? [];

        foreach ($inputs as $key => $value) {
            $setting = Setting::where('key', $key)->first();

            if (!$setting) continue;

            if ($setting->type === 'image') {
                if ($request->hasFile("settings.$key")) {
                    // Delete old image
                    if ($setting->value) {
                        Storage::disk('public')->delete($setting->value);
                    }

                    // Store new image in public/settings
                    $path = $request->file("settings.$key")->store('settings', 'public');
                    $setting->value = $path;
                }
                // Skip updating if no new file is provided (prevents overwriting path with URL string)
            } else {
                // Handle JSON or simple text
                $setting->value = $setting->type === 'json' && !is_string($value)
                    ? json_encode($value)
                    : $value;
            }

            if ($setting->isDirty()) {
                $setting->updated_by = auth()->id();
                $setting->save();
            }
        }

        // IMPORTANT: Clear cache
        Cache::forget('global_settings');

        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui.');
    }
}
