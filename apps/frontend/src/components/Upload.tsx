"use client";
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { UploadImage } from "@/components/UploadImage";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

export const Upload = () => {
    const [images, setImages] = useState<string[]>([]);
    const [title, setTitle] = useState("");
    const [txSignature, setTxSignature] = useState("");
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const router = useRouter();

    async function onSubmit() {
        const response = await axios.post(`${BACKEND_URL}/v1/user/task`, {
            options: images.map(image => ({
                imageUrl: image,
            })),
            title,
            signature: txSignature
        }, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })

        router.push(`/task/${response.data.id}`)
    }

    async function makePayment() {
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey!,
                toPubkey: new PublicKey("2KeovpYvrgpziaDsq8nbNMP4mc48VNBVXb5arbqrg9Cq"),
                lamports: 100000000,
            })
        );

        const {
            context: { slot: minContextSlot },
            value: { blockhash, lastValidBlockHeight }
        } = await connection.getLatestBlockhashAndContext();

        const signature = await sendTransaction(transaction, connection, { minContextSlot });

        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
        setTxSignature(signature);
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold mb-4 gradient-text">Create a Task</h2>
                <p className="text-high-contrast mb-6">Upload your images and get them labeled by our expert workforce.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-high-contrast mb-2">
                        Task Title
                    </label>
                    <input 
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3"
                        placeholder="What is your task?"
                        required 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-high-contrast mb-4">
                        Add Images
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {images.map((image, index) => (
                            <UploadImage 
                                key={index}
                                image={image} 
                                onImageAdded={(imageUrl) => {
                                    setImages(i => [...i, imageUrl]);
                                }} 
                            />
                        ))}
                        <UploadImage 
                            onImageAdded={(imageUrl) => {
                                setImages(i => [...i, imageUrl]);
                            }} 
                        />
                    </div>
                </div>

                <div className="flex justify-center pt-6">
                    <button 
                        onClick={txSignature ? onSubmit : makePayment}
                        type="button"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all hover-lift"
                    >
                        {txSignature ? "Submit Task" : "Pay 0.1 SOL"}
                    </button>
                </div>
            </div>
        </div>
    );
}