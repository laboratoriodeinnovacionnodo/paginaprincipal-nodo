import Image from "next/image"

interface UserPhotoProps {
  name: string
  photoURL?: string | null
  sizeClass?: string
}

export function UserPhoto({ name, photoURL, sizeClass = "h-10 w-10" }: UserPhotoProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  if (photoURL) {
    return (
      <Image
        src={photoURL}
        alt={name}
        width={40}
        height={40}
        className={`${sizeClass} rounded-full object-cover`}
        referrerPolicy="no-referrer"
      />
    )
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-cyan-500 flex items-center justify-center text-white font-semibold text-sm`}
    >
      {initials}
    </div>
  )
}
