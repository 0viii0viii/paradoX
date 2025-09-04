import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge, Edit, Eye, Plus, Trash2 } from "lucide-react";

const MEMO_DUMMY = [
  {
    id: 1,
    title: "메모 1",
    isEncrypted: false,
    lines: [
      {
        id: 1,
        text: "메모 1 내용",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function MemoPage() {
  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      <div>
        <h1>메모</h1>
      </div>
      <div className="flex gap-2">
        <Input placeholder="메모 제목을 입력하세요." />
        <Button>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto pb-4">
        {MEMO_DUMMY.map((memo) => (
          <Card key={memo.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="mb-1">{memo.title}</h3>
                  {memo.isEncrypted && (
                    <Badge className="text-xs">암호화됨</Badge>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    //   onClick={handleToggleContent}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter className="flex-col gap-2"></CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default MemoPage;
