<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::orderBy('group')->orderBy('id')->get()
            ->groupBy('group')
            ->map(fn($group) => $group->map(fn($s) => [
                'id' => $s->id,
                'key' => $s->key,
                'label' => $s->label,
                'value' => $s->formatted_value,
                'type' => $s->type,
            ]));

        return Inertia::render('admin/settings/index/page', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.*.id' => 'required|exists:settings,id',
            'settings.*.value' => 'required',
        ]);

        foreach ($request->settings as $data) {
            $setting = Setting::find($data['id']);
            $value = $setting->type === 'json'
                ? (is_string($data['value']) ? $data['value'] : json_encode($data['value']))
                : $data['value'];

            $setting->update([
                'value' => $value,
                'updated_by' => auth()->id(),
            ]);
        }

        return redirect()->back()->with('success', 'Pengaturan berhasil disimpan.');
    }
}
