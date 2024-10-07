"use client";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { Card, CardBody } from "@nextui-org/card";
import { TrashIcon, CheckCircleIcon, ArrowDownIcon } from "@heroicons/react/24/solid"; // Example with Heroicons
import {Pagination} from "@nextui-org/pagination";
import { ArrowLeft } from "lucide-react";
import { rewardData } from "../rewardData";



export default function InspectorScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set());

  const filteredData = rewardData.filter((item) =>
    item.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* 헤더 */}
      <header className="bg-white p-4 sticky top-0 z-20 shadow-sm flex ">
        <Button isIconOnly variant="ghost" className="mr-2">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-bold">리워드 관리 : 박기완</h1>
      </header>
    <div className="p-4 max-w-7xl mx-auto">
        
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardBody className="p-4">
            <h2 className="font-bold mb-2">사용자: KKY</h2>
            <p>슬롯 전체 개수: 50</p>
            <p>전체 개수중 가용 개수: 5</p>
          </CardBody>
        </Card>
        <div className="flex justify-between">
            
          </div>
        <div className="flex flex-col justify-between">
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="KKY 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mr-2"
            />
            <Button color="success">검색</Button>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex items-center space-x-2">
            <Button color="success" className="flex items-center space-x-1">
              <CheckCircleIcon className="w-5 h-5" />
              <span>전체 선택</span>
            </Button>
            <Button color="success" className="flex items-center space-x-1">
              <TrashIcon className="w-5 h-5" />
              <span>전체 삭제</span>
            </Button>
            <Button color="success" className="flex items-center space-x-1">
              <ArrowDownIcon className="w-5 h-5" />
              <span>선택 저장</span>
            </Button>
          </div>
        </div>
      </div>
      <Table
        aria-label="리워드 테이블"
        selectionMode="multiple"
        defaultSelectedKeys={["2", "3"]}
      >
        <TableHeader>
          <TableColumn>등록 번호</TableColumn>
          <TableColumn>사용자</TableColumn>
          <TableColumn>리워드 ID</TableColumn>
          <TableColumn>생성여부</TableColumn>
          <TableColumn>키워드</TableColumn>
          <TableColumn>판매처</TableColumn>
          <TableColumn>단가</TableColumn>
          <TableColumn>상품 코드</TableColumn>
          <TableColumn>슬롯시작일시</TableColumn>
          <TableColumn>슬롯종료일시</TableColumn>
          <TableColumn>유입</TableColumn>
          <TableColumn>실유입</TableColumn>
          <TableColumn>메모</TableColumn>
        </TableHeader>
        <TableBody>
          {rewardData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.user}</TableCell>
              <TableCell>{item.rewardId}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.keyword}</TableCell>
              <TableCell>{item.vendor}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{item.productCode}</TableCell>
              <TableCell>{item.slotStart}</TableCell>
              <TableCell>{item.slotEnd}</TableCell>
              <TableCell>{item.inflow}</TableCell>
              <TableCell>{item.actualInflow}</TableCell>
              <TableCell>?</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="p-4" isCompact showControls total={10} initialPage={1} />

    </div>
    </>
  );
}
