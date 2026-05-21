"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingCart, Clock, TrendingUp, ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getStats } from "@/lib/api";
import { statusAr, statusColor, formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then((r) => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const orderGrowth = stats ? stats.lastMonthOrders > 0
    ? Math.round(((stats.monthOrders - stats.lastMonthOrders) / stats.lastMonthOrders) * 100)
    : stats.monthOrders > 0 ? 100 : 0 : 0;

  const maxRevenue = stats?.monthlyRevenue ? Math.max(...stats.monthlyRevenue.map((m: any) => m.revenue), 1) : 1;

  return (
    <div dir="ltr">
      <div className="mb-8">
        <h1 className="text-3xl font-display tracking-widest">DASHBOARD</h1>
        <p className="text-gray-400 text-xs tracking-wider mt-1">SEENWAYS Store Overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="bg-white border border-gray-100 p-6 h-32 animate-pulse rounded" />)
        ) : [
          { label: "Active Products", value: stats?.totalProducts, icon: Package, sub: "In store" },
          { label: "Total Orders", value: stats?.totalOrders, icon: ShoppingCart, sub: `${stats?.monthOrders} this month` },
          { label: "Pending Orders", value: stats?.pendingOrders, icon: Clock, sub: "Need attention", alert: stats?.pendingOrders > 0 },
          { label: "Total Revenue", value: formatPrice(stats?.revenue || 0), icon: TrendingUp, sub: `${formatPrice(stats?.monthRevenue || 0)} this month` },
        ].map((card) => (
          <div key={card.label} className={`bg-white border p-5 hover:border-black transition-colors ${card.alert ? "border-amber-200 bg-amber-50" : "border-gray-100"}`}>
            <div className="flex items-start justify-between mb-3">
              <card.icon size={18} className={card.alert ? "text-amber-500" : "text-gray-400"} />
              {card.label === "Total Orders" && orderGrowth !== 0 && (
                <span className={`text-[10px] flex items-center gap-0.5 ${orderGrowth > 0 ? "text-green-500" : "text-red-400"}`}>
                  {orderGrowth > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {Math.abs(orderGrowth)}%
                </span>
              )}
            </div>
            <p className="text-2xl font-display tracking-widest mb-1">{card.value}</p>
            <p className="text-[10px] text-gray-400 tracking-wider uppercase">{card.label}</p>
            <p className="text-[10px] text-gray-300 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-display tracking-widest">REVENUE — LAST 6 MONTHS</h2>
            <span className="text-[10px] text-gray-400 tracking-wider uppercase">EGP</span>
          </div>
          {loading ? (
            <div className="h-40 bg-gray-50 animate-pulse rounded" />
          ) : (
            <div className="flex items-end gap-3 h-40">
              {stats?.monthlyRevenue?.map((m: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[9px] text-gray-400">{m.revenue > 0 ? formatPrice(m.revenue).replace(" ج.م", "") : ""}</span>
                  <div className="w-full bg-black rounded-sm transition-all hover:bg-gray-700"
                    style={{ height: `${Math.max((m.revenue / maxRevenue) * 120, m.revenue > 0 ? 8 : 2)}px` }} />
                  <span className="text-[9px] text-gray-400 tracking-wider">{m.month}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Status */}
        <div className="bg-white border border-gray-100 p-6">
          <h2 className="text-sm font-display tracking-widest mb-6">ORDER STATUS</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-gray-50 animate-pulse rounded" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.ordersByStatus?.map((s: any) => (
                <div key={s.status} className="flex items-center justify-between">
                  <span className={`text-[10px] px-2.5 py-1 tracking-widest uppercase ${statusColor[s.status]}`}>
                    {statusAr[s.status]}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: `${Math.min((s._count / stats.totalOrders) * 100, 100)}%` }} />
                    </div>
                    <span className="text-xs font-medium w-4 text-right">{s._count}</span>
                  </div>
                </div>
              ))}
              {!stats?.ordersByStatus?.length && <p className="text-xs text-gray-400 text-center py-4">No orders yet</p>}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-sm font-display tracking-widest">RECENT ORDERS</h2>
            <Link href="/admin/orders" className="text-xs tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-1 uppercase">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              [...Array(4)].map((_, i) => <div key={i} className="p-5 h-14 animate-pulse" />)
            ) : stats?.recentOrders?.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-xs tracking-widest uppercase">No orders yet</div>
            ) : (
              stats?.recentOrders?.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-xs font-medium tracking-wider">{order.orderNumber}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{order.customer?.name} · {order.customer?.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2.5 py-1 tracking-widest uppercase ${statusColor[order.status]}`}>
                      {statusAr[order.status]}
                    </span>
                    <p className="text-xs font-medium">{formatPrice(order.totalAmount)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Products + Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 p-6">
            <h2 className="text-sm font-display tracking-widest mb-4">TOP PRODUCTS</h2>
            <div className="space-y-3">
              {loading ? (
                [...Array(3)].map((_, i) => <div key={i} className="h-8 bg-gray-50 animate-pulse rounded" />)
              ) : stats?.topProducts?.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-2">No sales yet</p>
              ) : (
                stats?.topProducts?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <p className="text-xs truncate flex-1">{item.product?.name || "Unknown"}</p>
                    <span className="text-[10px] bg-black text-white px-2 py-0.5 ml-2 flex-shrink-0">{item._sum?.quantity} sold</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6">
            <h2 className="text-sm font-display tracking-widest mb-4">QUICK ACTIONS</h2>
            <div className="space-y-2">
              {[
                { label: "Add Product", href: "/admin/products" },
                { label: "Manage Orders", href: "/admin/orders" },
                { label: "Coupons", href: "/admin/coupons" },
                { label: "View Store", href: "/", external: true },
              ].map((a) => (
                <Link key={a.label} href={a.href} target={a.external ? "_blank" : undefined}
                  className="flex items-center justify-between p-3 border border-gray-100 hover:border-black transition-all group text-xs tracking-widest uppercase">
                  {a.label}
                  <ArrowRight size={12} className="text-gray-300 group-hover:text-black transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
