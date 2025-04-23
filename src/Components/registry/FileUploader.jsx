import React, { useState } from 'react'
import { Button } from '@/Components/ui/button'
import { Upload, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/Components/ui/alert'

export default function FileUploader({ onUploadComplete }) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setIsLoading(true)
        setError(null)

        try {
            const text = await file.text()
            const devices = parseIORegistry(text)

            console.log(`Parsed ${devices.length} devices from file`)

            // First clear existing devices
            try {
                const existingDevices = await IODevice.list()
                for (const device of existingDevices) {
                    await IODevice.delete(device.id)
                }
            } catch (e) {
                console.error('Error clearing existing devices:', e)
            }

            // Create new devices in batches
            if (devices.length > 0) {
                // First create the root device
                const rootDevice = devices.find((d) => d.name === 'Root')
                if (rootDevice) {
                    await IODevice.create(rootDevice)

                    // Then create all non-root devices in batches
                    const nonRootDevices = devices.filter((d) => d.name !== 'Root')
                    for (let i = 0; i < nonRootDevices.length; i += 5) {
                        const batch = nonRootDevices.slice(i, i + 5)
                        await IODevice.bulkCreate(batch)
                    }
                } else {
                    for (let i = 0; i < devices.length; i += 5) {
                        const batch = devices.slice(i, i + 5)
                        await IODevice.bulkCreate(batch)
                    }
                }
            }

            onUploadComplete()
        } catch (error) {
            console.error('Error parsing file:', error)
            setError('Failed to parse the file. Please check the format and try again.')
        } finally {
            setIsLoading(false)
        }
    }

    // Parse the IOReg log format
    const parseIORegistry = (text) => {
        const lines = text.split('\n')
        const devices = []
        let currentDevice = null
        let parentStack = [{ id: 'root-1', depth: -1 }]
        let inProperties = false
        let properties = {}

        // First create a root node if not exists
        devices.push({
            name: 'Root',
            className: 'IORegistryEntry',
            id: 'root-1',
            status: 'active',
            properties: {},
        })

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trimEnd()

            // Skip empty lines
            if (!line.trim()) continue

            // Check if we're starting a new device entry
            const deviceMatch = line.match(
                /(\s*)(\+-o|\|-o)\s+(.+?)\s+<class\s+(.+?),\s+id\s+(.+?),\s+(.+?)>/
            )
            if (deviceMatch) {
                // If we were parsing properties for a previous device, save them
                if (currentDevice && inProperties) {
                    currentDevice.properties = properties
                    devices.push(currentDevice)
                    properties = {}
                    inProperties = false
                }

                const [, indentation, , name, className, id, status] = deviceMatch
                const depth = Math.floor(indentation.length / 2) + 1 // +1 because root is at 0

                // Update parent stack based on depth
                while (
                    parentStack.length > 0 &&
                    parentStack[parentStack.length - 1].depth >= depth
                ) {
                    parentStack.pop()
                }

                const parentId =
                    parentStack.length > 0 ? parentStack[parentStack.length - 1].id : 'root-1'

                // Use a consistent ID format that won't cause issues
                const safeId = id.replace(/[^a-zA-Z0-9-_]/g, '-')

                currentDevice = {
                    name,
                    className,
                    id: safeId,
                    status,
                    properties: {},
                    parentId,
                }

                parentStack.push({ id: safeId, depth })
                continue
            }

            // Check if we're entering properties block
            if (line.trim() === '{') {
                inProperties = true
                continue
            }

            // Check if we're exiting properties block
            if (line.trim() === '}') {
                if (currentDevice) {
                    currentDevice.properties = properties
                    devices.push(currentDevice)
                    currentDevice = null
                    properties = {}
                }
                inProperties = false
                continue
            }

            // Parse property
            if (inProperties) {
                const propertyMatch = line.match(/\s*"(.+?)"\s*=\s*(.+)/)
                if (propertyMatch) {
                    const [, key, rawValue] = propertyMatch

                    // Try to parse the value as JSON if possible
                    let value = rawValue.trim()

                    // Handle special cases
                    if (value === 'Yes' || value === 'No') {
                        value = value === 'Yes'
                    } else if (value.startsWith('{') && value.endsWith('}')) {
                        try {
                            // Replace = with : for JSON compatibility
                            const jsonCompatible = value.replace(/(\w+)=/g, '"$1":')
                            value = JSON.parse(jsonCompatible)
                        } catch (_e) {
                            // Keep as string if parsing fails
                        }
                    } else if (value.startsWith('(') && value.endsWith(')')) {
                        // Handle array-like structures
                        try {
                            const arrayContent = value.substring(1, value.length - 1)
                            value = arrayContent.split(',').map((item) => item.trim())
                        } catch (_e) {
                            // Keep as string if parsing fails
                        }
                    } else if (value === '<>') {
                        value = null
                    } else if (!isNaN(Number(value))) {
                        value = Number(value)
                    }

                    properties[key] = value
                }
            }
        }

        // Add final device if needed
        if (currentDevice && Object.keys(properties).length > 0) {
            currentDevice.properties = properties
            devices.push(currentDevice)
        }

        return devices
    }

    return (
        <div className="flex flex-col gap-2">
            <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".txt,.log"
                onChange={handleFileUpload}
            />
            <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload').click()}
                disabled={isLoading}
                className="w-full bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 hover:text-gray-100"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Parsing...
                    </>
                ) : (
                    <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload IOReg Log
                    </>
                )}
            </Button>
            {error && (
                <Alert variant="destructive" className="bg-red-900/50 border-red-800 text-red-200">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}
