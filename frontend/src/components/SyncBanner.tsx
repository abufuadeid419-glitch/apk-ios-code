import { useState } from "react";
import { Pressable, View } from "react-native";

import { discardFailed, retryFailed, syncQueue, useSyncState } from "@/src/offline";
import { fonts, spacing, useTheme } from "@/src/theme";
import { Btn, Ionicons, Row, Sheet, T } from "@/src/ui";

// Shows connectivity + pending/failed offline actions. Hidden when all is synced.
// Includes a progress indicator for large flushes (thousands of items).
export function SyncBanner() {
  const { colors } = useTheme();
  const { pending, failed, online, syncing, progress } = useSyncState();
  const [open, setOpen] = useState(false);
  if (online && !pending.length && !failed.length) return null;
  const tone = failed.length ? colors.error : online ? colors.info : colors.warning;
  const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;
  const text = !online
    ? `بدون اتصال · ${pending.length} عملية بانتظار المزامنة`
    : syncing && progress.total > 0
      ? `جارِ المزامنة · ${progress.done}/${progress.total} (${pct}%)`
      : syncing
        ? "جارِ المزامنة..."
        : failed.length
          ? `${failed.length} عملية فشلت مزامنتها`
          : `${pending.length} عملية بانتظار المزامنة`;
  return (
    <>
      <Pressable testID="sync-banner" onPress={() => setOpen(true)} style={{ backgroundColor: tone, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, gap: spacing.xs }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
          <Ionicons name={online ? "sync-outline" : "cloud-offline-outline"} size={18} color={colors.onInfo} />
          <T style={{ flex: 1, color: colors.onInfo, fontFamily: fonts.semibold, fontSize: 13 }}>{text}</T>
          <Ionicons name="chevron-back" size={16} color={colors.onInfo} />
        </View>
        {syncing && progress.total > 0 && (
          <View testID="sync-progress-bar" style={{ height: 3, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.25)", overflow: "hidden" }}>
            <View style={{ width: `${pct}%`, height: 3, backgroundColor: "rgba(255,255,255,0.9)" }} />
          </View>
        )}
      </Pressable>
      <Sheet testID="sync-sheet" visible={open} onClose={() => setOpen(false)} title="المزامنة" footer={<Btn testID="sync-now-button" title="مزامنة الآن" icon="sync-outline" loading={syncing} onPress={syncQueue} />}>
        <T v="caption">العمليات المسجلة دون اتصال تُحفظ على الجهاز وتُرسل تلقائياً عند عودة الإنترنت. التعارضات تُحسم تلقائياً لصالح الخادم.</T>
        {syncing && progress.total > 0 && (
          <T v="caption" color="info">قيد المعالجة الآن: {progress.done} من أصل {progress.total}</T>
        )}
        {pending.map((p) => (
          <Row
            key={p.id}
            testID={`pending-item-${p.id}`}
            icon="time-outline"
            title={p.label}
            subtitle={(p.attempts ?? 0) > 0 ? `محاولة ${p.attempts}/5 · إعادة المحاولة قريباً` : "بانتظار المزامنة"}
          />
        ))}
        {failed.map((f) => (
          <View key={f.id}>
            <Row
              testID={`failed-item-${f.id}`}
              icon="alert-circle-outline"
              title={f.label}
              subtitle={f.error}
              right={
                <View style={{ flexDirection: "row", gap: spacing.xs }}>
                  <Btn small variant="secondary" title="إعادة" testID={`retry-failed-${f.id}`} onPress={() => retryFailed(f.id)} />
                  <Btn small variant="ghost" title="تجاهل" testID={`discard-failed-${f.id}`} onPress={() => discardFailed(f.id)} />
                </View>
              }
            />
          </View>
        ))}
        {!pending.length && !failed.length && <T>كل العمليات متزامنة</T>}
      </Sheet>
    </>
  );
}
