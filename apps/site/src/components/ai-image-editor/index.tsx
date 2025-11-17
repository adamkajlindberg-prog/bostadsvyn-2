"use client"

import ContainerWrapper from "@/components/common/container-wrapper"
import { BotIcon, CircleAlertIcon, DownloadIcon, ImageIcon, LoaderCircleIcon, ScanIcon, Share2Icon, SparklesIcon, WandSparklesIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation"
import { Message, MessageAvatar, MessageContent } from "@/components/ai-elements/message"
import { PromptInput, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input"
import imageOne from "@/images/property-image-1.webp"
import imageTwo from "@/images/property-image-2.webp"
import imageThree from "@/images/property-image-3.webp"
import imageFour from "@/images/property-image-4.webp"
import { useRef, useState } from "react"
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Response } from "@/components/ai-elements/response"
import ImageFullModal, { modalKey } from "./modal/image-full-modal"
import { useModalStore } from "@/stores/use-modal-store"
import { WEB_URL } from "@/../env-client"
import SelectImageModal from "./modal/select-image-modal"
import { useSelectImageStore } from "@/stores/use-select-image"

const propertyImages = [
    {
        index: 1,
        src: imageOne
    },
    {
        index: 2,
        src: imageTwo
    },
    {
        index: 3,
        src: imageThree
    },
    {
        index: 4,
        src: imageFour
    }
]

const ImageEditor = () => {
    const [input, setInput] = useState<string>("");
    const [imagePreview, setImagePreview] = useState<{
        before: string
        after: string
    } | null>(null)
    
    const lastSentImageIndex = useRef<number | null>(null)

    const { selectedImage, setSelectedImage } = useSelectImageStore((state) => state)

    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/ai/image-editor"
        })
    })

    const { setModal } = useModalStore()

    const handleSubmit = () => {
        const image = propertyImages.find(img => img.index === selectedImage)
        const parts = []

        // Only send image if it's different from last sent
        if (lastSentImageIndex.current !== selectedImage && typeof image?.src?.src === "string" && image.src.src.trim().length > 0) {
            parts.push({
                type: 'file' as const,
                mediaType: 'image/png',
                url: `${WEB_URL}${image.src.src}`
            })
            lastSentImageIndex.current = selectedImage
        }

        parts.push({ type: 'text' as const, text: input })

        sendMessage({
            role: 'user',
            parts
        })
        setInput("")
    }

    const handleDownloadImage = (url: string) => {
        const link = document.createElement("a")
        link.href = url
        link.download = `ai-edited-${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleImagePreview = (after: string) => {
        // Find the message index that contains this generated image
        const currentMessageIndex = messages.findIndex(message => 
            message.role === "assistant" && 
            message.parts.some(part => 
                part.type === "file" && 
                part.mediaType?.startsWith("image/") && 
                part.url === after
            )
        );

        let beforeImage: string = "";

        if (currentMessageIndex !== -1) {
            // Look backwards to find nearest user image file
            for (let i = currentMessageIndex - 1; i >= 0; i--) {
                const message = messages[i];
                if (message.role === "user") {
                    const filePart = message.parts.find(part => 
                        part.type === "file" && 
                        part.mediaType?.startsWith("image/")
                    );
                    
                    if (filePart) {
                        beforeImage = filePart.type === 'file' ? filePart.url : ''
                        break;
                    }
                }
            }
        }

        setImagePreview({ before: beforeImage, after })
        setModal(modalKey)
    }
    
    return (
        <>
            <div className="@container">
                <ContainerWrapper className="py-10">
                    <div className="flex flex-wrap items-center gap-2.5 mb-2">
                        <WandSparklesIcon className="text-primary h-6 w-6 @lg:h-7 @lg:w-7" />
                        <h2 className="text-2xl @lg:text-3xl tracking-tight font-semibold">
                            AI Renoveringsverktyg
                        </h2>
                        <div className="flex items-center gap-1 bg-primary text-xs text-primary-foreground font-medium px-2 py-0.5 rounded-full">
                            <SparklesIcon size={12} />
                            Gratis
                        </div>
                    </div>

                    <p className="text-sm @lg:text-base text-muted-foreground mb-2">{`Visualisera renoveringar och förändringar för "Charmigt radhus med trädgård"`}</p>
                    <div className="flex gap-1.5 items-center text-xs @lg:text-sm text-amber-600 mb-8">
                        <CircleAlertIcon size={16} />
                        Logga in för att spara och dela dina AI-redigeringar
                    </div>

                    <div className="grid grid-cols-1 @5xl:grid-cols-12 gap-6">
                        <Card className="@5xl:col-span-4 py-0 shadow-xs overflow-hidden h-[710px] hidden @5xl:flex flex-col">
                            <CardContent className="px-0 h-full flex flex-col">
                                <div className="p-6">
                                    <div className="flex flex-wrap items-center gap-2 pb-1.5">
                                        <ImageIcon className="text-primary "/>
                                        <h3 className="text-2xl font-semibold tracking-tight leading">Fastighetsbilder</h3>
                                    </div>

                                    <p className="text-sm text-muted-foreground">Klicka på en bild för att välja den för AI-redigering</p>
                                </div>

                                <div className="space-y-4 p-6 border-t overflow-y-auto">
                                    {propertyImages.map((image) => (
                                        <button 
                                            key={`property-image-${image.index}`} 
                                            className={`w-full relative overflow-hidden h-44 rounded-lg group border-2 cursor-pointer ${selectedImage === image.index && "border-primary"}`}
                                            onClick={() => setSelectedImage(image.index)}
                                        >
                                            <Image src={image.src} alt={`Fastighetsbild ${image.index}`} fill sizes="100%" className="object-cover" />
                                            <div className="absolute top-3 left-3 text-xs font-medium bg-nordic-snow text-primary px-3 py-1 rounded-full">Bild {image.index}</div>
                                            {selectedImage === image.index && (
                                                <div className="absolute top-3 right-3 text-xs font-medium bg-primary text-primary-foreground px-3 py-1 rounded-full">
                                                    Vald
                                                </div>
                                            )} 

                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="@5xl:col-span-8 py-0 shadow-xs h-[710px]">
                            <CardContent className="px-0 flex flex-col h-full">
                                <div className="p-6">
                                    <div className="flex flex-col @xl:flex-row @xl:justify-between items-start">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                <BotIcon className="text-primary "/>
                                                <h3 className="text-xl @lg:text-2xl font-semibold tracking-tight leading">AI Renoveringsassistent</h3>
                                            </div>

                                            <p className="text-sm text-muted-foreground">Beskriv vad du vill ändra på den valda bilden</p>
                                        </div>

                                        <SelectImageModal propertyImages={propertyImages} />
                                    </div>
                                </div>

                                <div className="px-6 border-t flex-1 overflow-y-auto">
                                    <Conversation className="relative w-full">
                                        <ConversationContent className="py-2 pl-0.5 pr-0">
                                            <Message from="assistant" className="items-start">
                                                <MessageContent className="group-[.is-assistant]:bg-muted">
                                                    Välkommen till AI-bildredigeraren för "Exklusiv villa med havsutsikt"! 🏠✨ <br /><br />
                                                    Jag kan hjälpa dig visualisera hur fastigheten skulle kunna se ut med olika förändringar: <br /><br />
                                                    <span>🎨 <strong>Måla om väggar</strong> - "Måla vardagsrummet i ljusblått"</span>
                                                    <span>🪑 <strong>Möblera om</strong> - "Lägg till en stor soffa och ett soffbord"</span>
                                                    <span>💡 <strong>Ändra belysning</strong> - "Lägg till varmare belysning"</span>
                                                    <span>🔧 <strong>Renovera</strong> - "Gör ett öppet kök mot vardagsrummet"</span> 
                                                    <span>🌿 <strong>Dekorera</strong> - "Lägg till växter och tavlor"</span> <br />
                                                    Den första bilden är vald som standard, men du kan välja vilken annan bild du föredrar. <br /><br />
                                                    När du har valt en bild, låt oss veta vilka ändringar du vill göra!  <br /><br />
                                                    <span>💡 <strong>Tips</strong>: Logga in för att spara och dela dina AI-redigeringar automatiskt!</span>
                                                </MessageContent>
                                                <MessageAvatar name="AI Assistant" src="/bot.svg" />
                                            </Message>

                                            {messages.map((message, index) => (
                                                <Message from={message.role} key={message.id} className="items-start">
                                                    <MessageContent className="group-[.is-assistant]:bg-muted">
                                                        {message.parts.map((part, i) => {
                                                            switch (part.type) {
                                                                case "text":
                                                                    return (
                                                                        <div key={`response-${message.id}-${i}`}>
                                                                            <Response>
                                                                                {part.text}
                                                                            </Response>

                                                                            {(status === "streaming" && message.role === "assistant" && index === messages.length - 1) && (
                                                                                <div className="flex flex-row items-center gap-2 mt-2 text-muted-foreground">
                                                                                    <LoaderCircleIcon className="animate-spin text-primary" /> AI arbetar...
                                                                                </div>
                                                                            )}      
                                                                        </div>
                                                                    );
                                                                case "file": 
                                                                    if(part.mediaType.startsWith("image/png") && message.role === "assistant") {
                                                                        return (
                                                                            <div key={`image-${message.id}-${i}`} className="aspect-video h-32 @lg:min-h-64 relative group">
                                                                                <Image src={part.url} alt="AI-bild" fill sizes="100%" className="object-cover" />                                
                                                                                
                                                                                <div className="absolute top-2 right-2 flex @4xl:hidden @4xl:group-hover:flex gap-2">
                                                                                    <button 
                                                                                        className="bg-nordic-snow text-primary-deep rounded-sm px-2.5 py-2 @2xl:px-3 @2xl:py-2.5 hover:bg-nordic-snow hover:text-primary-deep hover:opacity-90 cursor-pointer"
                                                                                        onClick={() => handleDownloadImage(part.url)}    
                                                                                    >
                                                                                        <DownloadIcon size={14} />
                                                                                    </button>
                                                                                    <button className="bg-nordic-snow text-primary-deep rounded-sm px-2.5 py-2 @2xl:px-3 @2xl:py-2.5 hover:bg-nordic-snow hover:text-primary-deep hover:opacity-90 cursor-pointer">
                                                                                        <Share2Icon size={14} />
                                                                                    </button>
                                                                                </div>

                                                                                <button 
                                                                                    className="absolute bottom-2 right-2 flex @4xl:hidden @4xl:group-hover:flex bg-nordic-snow/90 text-sm text-primary-deep rounded-sm px-2.5 py-2 @2xl:px-3 @2xl:py-2.5 hover:opacity-90 cursor-pointer"
                                                                                    onClick={() => handleImagePreview(part.url)}
                                                                                >
                                                                                    <ScanIcon size={16} />
                                                                                </button>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    else {
                                                                        return null
                                                                    }
                                                                default:
                                                                    return null
                                                            }
                                                        })}
                                                    </MessageContent>
                                                    {message.role === "assistant" && (
                                                        <MessageAvatar name="AI Assistant" src="/bot.svg" />
                                                    )}
                                                </Message>
                                            ))}
                                            
                                            {(status === "submitted") && (
                                                <Message from="assistant" className="items-start">
                                                    <MessageContent className="group-[.is-assistant]:bg-muted group-[.is-assistant]:text-muted-foreground flex flex-row items-center">
                                                        <LoaderCircleIcon className="animate-spin text-primary" /> AI arbetar...
                                                    </MessageContent>
                                                    <MessageAvatar name="AI Assistant" src="/bot.svg" />
                                                </Message>
                                            )}

                                            {status === "error" && (
                                                <Message from="assistant" className="items-start">
                                                    <MessageContent className="group-[.is-assistant]:bg-muted">
                                                        Oj, något gick fel när jag försökte bearbeta din begäran. Kan du försöka igen?
                                                    </MessageContent>
                                                    <MessageAvatar name="AI Assistant" src="/bot.svg" />
                                                </Message>
                                            )}
                                        </ConversationContent>
                                    </Conversation>
                                </div>

                                <div className="px-6 pt-4 pb-2 border-t">
                                    <PromptInput className="relative w-full mb-2.5" onSubmit={handleSubmit}>
                                        <PromptInputTextarea 
                                            className="pr-12 text-sm" 
                                            placeholder="Beskriv vad du vill ändra eller renovera..." 
                                            onChange={(e) => setInput(e.currentTarget.value)}
                                            value={input}
                                        />
                                        <PromptInputSubmit 
                                            className="absolute bottom-1 right-1 cursor-pointer" 
                                            disabled={!input.trim() || status !== "ready" || selectedImage === 0}
                                            status={status === "streaming" ? "streaming" : "ready"}
                                        />
                                    </PromptInput>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </ContainerWrapper>
            </div>

            <ImageFullModal beforeImage={imagePreview?.before ?? ""} afterImage={imagePreview?.after ?? ""} />
        </>
    )
}

export default ImageEditor