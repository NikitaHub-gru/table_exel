"use client";

import { useState } from "react";
import { Download, Search, SortAsc, SortDesc } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import * as XLSX from "xlsx";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - replace with actual API call
const mockData = [
  {
      "Delivery.ActualTime": "2024-10-30T20:15:20.881",
      "Delivery.Address": "ул. Северный Власихинский проезд д. 131 корп./стр. 3 кв./оф. 124 под. 1 эт. 12",
      "Delivery.CookingFinishTime": "2024-10-30T19:04:18.519",
      "Delivery.Courier": "Зорин Данил",
      "Delivery.CustomerPhone": "+79628164387",
      "Delivery.Delay": 0,
      "Delivery.DeliveryComment": "тек",
      "Delivery.ExpectedTime": "2024-10-30T20:15:55.006",
      "Delivery.Zone": "1. Бесплатная доставка ~70 минут. Минимальная сумма заказа 600р",
      "Department": "ДИММИ ЯММИ",
      "DishServicePrintTime": null,
      "OpenDate.Typed": "2024-10-30",
      "OpenTime": "2024-10-30T18:34:55",
      "OrderTime.OrderLength": 119,
      "OrderType": "Любовь и Суши_Доставка обычная"
    },
    {
      "Delivery.ActualTime": "2024-10-30T20:15:20.881",
      "Delivery.Address": "ул. Северный Власихинский проезд д. 131 корп./стр. 3 кв./оф. 124 под. 1 эт. 12",
      "Delivery.CookingFinishTime": "2024-10-30T19:04:18.519",
      "Delivery.Courier": "Зорин Данил",
      "Delivery.CustomerPhone": "+79628164387",
      "Delivery.Delay": 0,
      "Delivery.DeliveryComment": "тек",
      "Delivery.ExpectedTime": "2024-10-30T20:15:55.006",
      "Delivery.Zone": "1. Бесплатная доставка ~70 минут. Минимальная сумма заказа 600р",
      "Department": "ДИММИ ЯММИ",
      "DishServicePrintTime": "2024-10-30T18:38:16.489",
      "OpenDate.Typed": "2024-10-30",
      "OpenTime": "2024-10-30T18:34:55",
      "OrderTime.OrderLength": 119,
      "OrderType": "Любовь и Суши_Доставка обычная"
    },
      {
      "Delivery.ActualTime": "2024-10-30T15:02:56.647",
      "Delivery.Address": "ул. Трамвайный проезд д. 70 под. 1",
      "Delivery.CookingFinishTime": "2024-10-30T14:05:13.898",
      "Delivery.Courier": "Зорин Данил",
      "Delivery.CustomerPhone": "+79635030482",
      "Delivery.Delay": null,
      "Delivery.DeliveryComment": "тек",
      "Delivery.ExpectedTime": "2024-10-30T15:10:13.47",
      "Delivery.Zone": "1. Бесплатная доставка ~70 минут. Минимальная сумма заказа 600р",
      "Department": "ДИММИ ЯММИ",
      "DishServicePrintTime": "2024-10-30T13:44:26.792",
      "OpenDate.Typed": "2024-10-30",
      "OpenTime": "2024-10-30T13:42:13",
      "OrderTime.OrderLength": 134,
      "OrderType": "Любовь и Суши_Доставка обычная"
    },
  // Add more mock data here for testing
];

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
} | null;

export default function DeliveryOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [data, setData] = useState(mockData);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...data].sort((a, b) => {
      if (key === "Delivery.ActualTime") {
        return direction === "asc"
          ? new Date(a[key]).getTime() - new Date(b[key]).getTime()
          : new Date(b[key]).getTime() - new Date(a[key]).getTime();
      }
      
      return direction === "asc"
        ? a[key].localeCompare(b[key], "ru")
        : b[key].localeCompare(a[key], "ru");
    });

    setData(sorted);
    setSortConfig({ key, direction });
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Delivery Orders");
    XLSX.writeFile(workbook, `delivery_orders_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  const SortButton = ({ column }: { column: string }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {sortConfig?.key === column ? (
            sortConfig.direction === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )
          ) : (
            <SortAsc className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSort(column)}>
          Sort {sortConfig?.key === column && sortConfig.direction === "asc" ? "Descending" : "Ascending"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="container mx-auto py-10">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h2 className="text-2xl font-semibold leading-none tracking-tight">Заказы на доставку</h2>
          <p className="text-sm text-muted-foreground">
            Управление и просмотр заказов на доставку
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по всем полям..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[300px]"
              />
            </div>
            <Button onClick={exportToExcel}>
              <Download className="mr-2 h-4 w-4" />
              Экспорт в Excel
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">
                    Время доставки
                    <SortButton column="Delivery.ActualTime" />
                  </TableHead>
                  <TableHead>
                    Адрес
                    <SortButton column="Delivery.Address" />
                  </TableHead>
                  <TableHead>
                    Курьер
                    <SortButton column="Delivery.Courier" />
                  </TableHead>
                  <TableHead>
                    Телефон клиента
                    <SortButton column="Delivery.CustomerPhone" />
                  </TableHead>
                  <TableHead>
                    Отдел
                    <SortButton column="Department" />
                  </TableHead>
                  <TableHead>
                    Тип заказа
                    <SortButton column="OrderType" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(order["Delivery.ActualTime"]), "d MMMM yyyy HH:mm", { locale: ru })}
                    </TableCell>
                    <TableCell className="max-w-md break-words">
                      {order["Delivery.Address"]}
                    </TableCell>
                    <TableCell>{order["Delivery.Courier"]}</TableCell>
                    <TableCell>{order["Delivery.CustomerPhone"]}</TableCell>
                    <TableCell>{order["Department"]}</TableCell>
                    <TableCell>{order["OrderType"]}</TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Заказы не найдены
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}