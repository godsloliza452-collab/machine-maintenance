<td className="flex gap-3 py-2">
  <Link href={`/machines/${m.id}/edit`} className="text-blue-600 underline">
    แก้ไข
  </Link>
  <form action={deleteMachine}>
    <input type="hidden" name="id" value={m.id} />
    <button className="text-red-600 underline">ลบ</button>
  </form>
</td>