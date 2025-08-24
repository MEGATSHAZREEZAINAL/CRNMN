### Advanced Context Engineering — TODO

- **Immediate verifications (quick wins)**
  - [x] AppState reducer: tambah case hilang (`INVOICE_GENERATE`, `POST_SCHEDULE`, `POST_UPDATE_STATUS`, `PROJECT_ADD`, `SALES_UPDATE`, `INVENTORY_UPDATE`)
  - [x] PerformanceContext: tambah handler `UPDATE_MEMORY_USAGE`
  - [x] useRealTimeSync: guna functional update untuk `unreadChanges` dan betulkan dependencies supaya tidak resubscribe berulang
  - [x] AuthContext: stabilkan fungsi (`useCallback`) dan `contextValue` (`useMemo`)
  - [x] PhoneShellContext: expose `closePhoneShell` dalam context dan fix return type provider
  - [ ] Jalan `npm run type-check` dan `npm run build` (nota: ada error TypeScript sedia ada di `services/twilioService.ts` — perlu dibaiki, lihat bahagian “TypeScript cleanup”)

- **High-impact next (struktur & prestasi)**
  - [ ] Pisahkan context baca/tulis: `AppStateReadContext` (state sahaja) dan `AppStateActionsContext` (fungsi) untuk kurangkan re-render global
  - [ ] Perkenal context selectors: guna `use-context-selector` atau custom `useSyncExternalStore` untuk subscribe pada slice (cth: `useInventory()`, `useRecentSales()`)
  - [ ] Domain-sliced contexts: pecahkan `AppState` kepada `SalesContext`, `InventoryContext`, `CustomersContext`, `ProjectsContext`, `UIContext`; `MetricsContext` untuk derived data (AOV, margin, low stock)
  - [ ] PerformanceContext: pindahkan `cacheData`/`suspenseCache` kepada `useRef` (mutable, tidak trigger re-render), tambah metrik cache hit/miss dan invalidation TTL
  - [ ] HOC/util prestasi: gunakan `withPerformanceMonitoring` + `React.memo` pada komponen berat (`BusinessOS`, `AppLayout`, dashboards)
  - [ ] Selector hooks mengganti `useAppState()` broad di komponen UI (minimalkan prop drilling & dependencies)

- **Realtime & data layer**
  - [ ] Pastikan semua koleksi Firestore ada `user_id` untuk query `where('user_id','==', uid)`; buat index perlu di Firestore Console
  - [ ] Debounce/throttle `api.syncToServer()` dan centralize network status (gabung dengan `useOffline`)
  - [ ] Kemas presence tracking (RTDB): tambah auto-expiry, lokasi dinamik, helper `usePresence(location)`

- **Konfigurasi Firebase & env**
  - [ ] Harden `services/firebase.ts`: ganti fallback kunci prod dengan `requireEnv('VITE_FIREBASE_*')` + flag `VITE_USE_FIREBASE_EMULATORS` untuk sambungan emulator
  - [ ] Sahkan value `import.meta.env` pada boot; fail fast jika tiada di prod build

- **DevTools & observability**
  - [ ] `ContextDevTools`: throttle/memo `JSON.stringify`, hydrate data hanya bila tab aktif; tambah performance marks/measure
  - [ ] Tambah “Context Health Monitor” metrik sebenar (provider mount times, render cost, cache hit rate)

- **Testing & quality**
  - [ ] Unit test reducers (state transitions), actions, selector hooks (stability, memoization)
  - [ ] Render performance tests: uji re-render count untuk komponen utama bila slice lain berubah
  - [ ] E2E flow asas: login → dashboard → jualan → inventori → projek; sahkan UI tak jank semasa real-time updates

- **Performance budgets**
  - [ ] Set budget untuk re-render (< 5 per interaksi utama), masa render purata (< 8ms), memory usage threshold; pantau melalui PerformanceContext
  - [ ] Audit bundle (vite-bundle-visualizer): elak Node polyfills yang tidak diperlukan, pastikan Twilio hanya dipanggil melalui backend

- **TypeScript cleanup**
  - [ ] Baiki error TS di `services/twilioService.ts` (baris ±479 ke atas). Kemungkinan ada sisa merge/objek tidak lengkap/kurang kurungan. Pastikan fail lulus `tsc --noEmit`

- **Migrasi bertahap (cadangan plan)**
  - [ ] Fasa 1 (hari ini): verifikasi quick wins, audit selectors yang diperlukan oleh `BusinessOS`/`AppLayout`
  - [ ] Fasa 2: implement `AppStateRead/ActionsContext` + 2-3 selector hooks paling kritikal; apply pada 3 komponen tertinggi kos
  - [ ] Fasa 3: domain-slice untuk `Sales` dan `Inventory`; pindah derived metrics ke `MetricsContext`
  - [ ] Fasa 4: refactor PerformanceContext cache ke `useRef` + tambah observability; deploy DevTools throttling
  - [ ] Fasa 5: kemaskan Firebase config/env + tulis tests (reducers/selector hooks)
