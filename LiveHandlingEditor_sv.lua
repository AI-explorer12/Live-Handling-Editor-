RegisterCommand("handling", function(source, args)
    -- if IsPlayerAceAllowed(source, "LiveHandlingEditor") then
        TriggerClientEvent("LiveHandlingEditor", source, args)
    -- end
end, true)